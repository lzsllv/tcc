# Canais de Venda e Precificação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir configurar canais de venda e calcular preços mínimo, sustentável e recomendado para cada ficha técnica.

**Architecture:** Casos de uso puros gerenciam canais dentro do workspace, enquanto um serviço de aplicação compõe os cálculos financeiros existentes sem persistir resultados derivados. As telas React executam os casos de uso pelo `WorkspaceService`, exibem estados de persistência e recalculam preços ao trocar o canal.

**Tech Stack:** React 19, React Router 7, JavaScript ESM, CSS, Node Test Runner, Vite.

**Spec:** `docs/superpowers/specs/2026-08-25-canais-precificacao-design.md`

## Global Constraints

- Continuar frontend-first com persistência local pelo workspace v2.
- Valores monetários são inteiros em centavos e percentuais são inteiros em pontos-base.
- Resultados derivados nunca são persistidos como fonte de verdade.
- Não adicionar backend, estoque, histórico de vendas, integrações com pagamentos ou dependências.
- Operações ficam desabilitadas durante salvamento e preservam o último snapshot válido em caso de erro.
- Layout funcional em 320px, 768px, 1024px e largura ampla.

---

### Task 1: Casos de uso de canais de venda

**Files:**
- Create: `src/application/salesChannels.js`
- Create: `src/application/salesChannels.test.js`

**Interfaces:**
- Consumes: workspace v2 com `salesChannels` e `settings.selectedSalesChannelId` opcional.
- Produces: `createSalesChannel`, `updateSalesChannel`, `duplicateSalesChannel`, `setDefaultSalesChannel`, `archiveSalesChannel`, `deleteSalesChannel` e `selectSalesChannel`.

- [ ] **Step 1: Write failing CRUD and invariant tests**

```js
test('cria canal com taxas normalizadas sem alterar o workspace original', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  const updated = createSalesChannel(workspace, {
    name: 'Cartão', fees: [
      { name: 'Crédito', kind: 'percentage', category: 'payment', value: 350 },
      { name: 'Tarifa', kind: 'fixed', category: 'payment', value: 100 },
    ],
  }, { id: 'channel-card', feeIds: ['fee-credit', 'fee-fixed'], now: NOW });
  assert.equal(workspace.salesChannels.length, 1);
  assert.equal(updated.salesChannels[1].fees[0].value, 350);
});

test('mantém exatamente um canal padrão ativo', () => {
  const updated = setDefaultSalesChannel(workspaceWithCard(), 'channel-card', NOW);
  assert.equal(updated.salesChannels.filter(channel => channel.isDefault).length, 1);
  assert.equal(updated.salesChannels.find(channel => channel.id === 'channel-card').isDefault, true);
});
```

- [ ] **Step 2: Run the isolated test and confirm RED**

Run: `node --test src/application/salesChannels.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `salesChannels.js`.

- [ ] **Step 3: Implement input normalization and immutable CRUD**

```js
export function createSalesChannel(workspace, input, options = {}) {
  const now = options.now ?? new Date().toISOString();
  const channel = {
    id: options.id ?? crypto.randomUUID(), ownerId: workspace.ownerId,
    ...normalizeChannelInput(input, options.feeIds),
    active: true, isDefault: workspace.salesChannels.length === 0,
    createdAt: now, updatedAt: now,
  };
  return { ...workspace, salesChannels: [...workspace.salesChannels, channel], updatedAt: now };
}
```

- [ ] **Step 4: Add validation and destructive-operation tests**

```js
assert.throws(() => createSalesChannel(workspace, channel({ name: ' ' })), /nome/i);
assert.throws(() => createSalesChannel(workspace, channel({ fees: [{ kind: 'percentage', category: 'payment', value: 10000 }] })), /100%/i);
assert.throws(() => archiveSalesChannel(createEmptyWorkspace('user-1', NOW), 'channel-direct', NOW), /último canal ativo/i);
assert.throws(() => deleteSalesChannel(workspace, 'channel-direct', NOW), /padrão/i);
```

- [ ] **Step 5: Run isolated and full tests**

Run: `node --test src/application/salesChannels.test.js && npm test`
Expected: all channel tests and the complete suite PASS.

- [ ] **Step 6: Commit channel use cases**

```bash
git add src/application/salesChannels.js src/application/salesChannels.test.js
git commit -m "feat: adiciona casos de uso de canais de venda"
```

### Task 2: Precificação integrada por canal

**Files:**
- Create: `src/application/offerPricing.js`
- Create: `src/application/offerPricing.test.js`

**Interfaces:**
- Consumes: `calculateOfferVariableCost`, `allocateFixedCostsPerUnit`, `calculatePriceReferences`, workspace, offerId e channelId.
- Produces: `priceOfferForChannel(workspace, offerId, channelId)` com `{ costs, fixedAllocation, marginBps, fees, prices }`.

- [ ] **Step 1: Write a failing integrated pricing test with literal expectations**

```js
test('calcula as três referências para a oferta no canal selecionado', () => {
  const result = priceOfferForChannel(workspaceFixture(), 'offer-1', 'channel-card');
  assert.deepEqual(result.prices, {
    minimumPriceCents: 1167,
    sustainablePriceCents: 1722,
    recommendedPriceCents: 2462,
  });
});
```

- [ ] **Step 2: Run the isolated test and confirm RED**

Run: `node --test src/application/offerPricing.test.js`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `offerPricing.js`.

- [ ] **Step 3: Implement orchestration using domain functions**

```js
export function priceOfferForChannel(workspace, offerId, channelId) {
  const offer = findActiveOffer(workspace, offerId);
  const channel = findActiveChannel(workspace, channelId);
  const ingredientsById = Object.fromEntries(workspace.ingredients.map(item => [item.id, item]));
  const costs = calculateOfferVariableCost(offer, ingredientsById, workspace.settings.laborHourCents);
  const fixedAllocation = allocateFixedCostsPerUnit(totalFixedCosts(workspace.fixedCosts), workspace.offers);
  const marginBps = offer.desiredMarginBps ?? workspace.settings.defaultMarginBps;
  return composePriceResult(costs, fixedAllocation, marginBps, channel.fees);
}
```

- [ ] **Step 4: Add missing-planning, default-margin and recalculation tests**

```js
assert.equal(priceOfferForChannel(noPlanning, 'offer-1', 'channel-direct').prices.minimumPriceCents, 1000);
assert.equal(priceOfferForChannel(noPlanning, 'offer-1', 'channel-direct').prices.sustainablePriceCents, null);
assert.notEqual(priceOfferForChannel(beforeIngredientChange, 'offer-1', 'channel-direct').prices.minimumPriceCents,
  priceOfferForChannel(afterIngredientChange, 'offer-1', 'channel-direct').prices.minimumPriceCents);
```

- [ ] **Step 5: Run isolated and full tests**

Run: `node --test src/application/offerPricing.test.js && npm test`
Expected: all pricing tests and the complete suite PASS.

- [ ] **Step 6: Commit integrated pricing**

```bash
git add src/application/offerPricing.js src/application/offerPricing.test.js
git commit -m "feat: integra precificacao por canal"
```

### Task 3: Channel management interface

**Files:**
- Create: `src/pages/CanaisVenda.jsx`
- Create: `src/styles/CanaisVenda.css`
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar.jsx`

**Interfaces:**
- Consumes: channel use cases from Task 1 and `workspace`, `workspaceStatus`, `workspaceError`, `atualizarWorkspace` from `useApp`.
- Produces: protected route `/canais-venda` and navigation entry `Canais de venda`.

- [ ] **Step 1: Build the editor and channel list**

```jsx
<form onSubmit={submit}>
  <input value={form.name} onChange={event => change('name', event.target.value)} required />
  {form.fees.map((fee, index) => <FeeRow key={fee.localId ?? fee.id} fee={fee} index={index} />)}
  <button type="button" onClick={addFee}>Adicionar taxa</button>
</form>
```

- [ ] **Step 2: Wire persistence actions and disabled saving state**

```js
await atualizarWorkspace(current => editingId
  ? updateSalesChannel(current, editingId, payload)
  : createSalesChannel(current, payload));
```

Cards call `duplicateSalesChannel`, `setDefaultSalesChannel`, `archiveSalesChannel` and `deleteSalesChannel`. Destructive actions require `window.confirm`; every action button receives `disabled={saving}`.

- [ ] **Step 3: Register route and navigation**

```jsx
<Route path="/canais-venda" element={<RotaProtegida><CanaisVenda /></RotaProtegida>} />
```

Add `{ caminho: '/canais-venda', Icon: CreditCard, nome: 'Canais de venda' }` after Custos Fixos in `Navbar.jsx`.

- [ ] **Step 4: Implement responsive and accessible CSS**

Use the existing `.pagina-grid`, token variables and sticky editor. Fee rows use four columns at wide widths, two at tablet and one at 420px. Every label uses a unique `htmlFor`; success uses `role="status"` and contextual errors use `alerta-erro`.

- [ ] **Step 5: Run lint and build**

Run: `npm run lint && npm run build`
Expected: both commands exit 0.

- [ ] **Step 6: Commit channel interface**

```bash
git add src/pages/CanaisVenda.jsx src/styles/CanaisVenda.css src/App.jsx src/components/Navbar.jsx
git commit -m "feat: adiciona tela de canais de venda"
```

### Task 4: Product pricing cards and persistent selection

**Files:**
- Modify: `src/pages/Produtos.jsx`
- Modify: `src/styles/Produtos.css`
- Modify: `src/persistence/workspace.js`
- Modify: `src/persistence/workspace.test.js`

**Interfaces:**
- Consumes: `priceOfferForChannel`, `selectSalesChannel`, workspace offers and active channels.
- Produces: persistent selected channel and three reference-price cards per active offer.

- [ ] **Step 1: Write failing workspace default-selection test**

```js
test('workspace vazio seleciona o canal padrão', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  assert.equal(workspace.settings.selectedSalesChannelId, 'channel-direct');
});
```

- [ ] **Step 2: Run test and confirm RED**

Run: `node --test src/persistence/workspace.test.js`
Expected: FAIL because `selectedSalesChannelId` is undefined.

- [ ] **Step 3: Add the backward-compatible setting**

```js
settings: {
  businessName: '', logo: '', region: '', laborHourCents: 0,
  defaultMarginBps: 0, selectedSalesChannelId: 'channel-direct',
},
```

Preserve this field in migration output and let the product page fall back to the active default when loading older workspaces.

- [ ] **Step 4: Add channel selector and price references to products**

```jsx
<select value={selectedChannelId} onChange={event => selectChannel(event.target.value)}>
  {activeChannels.map(channel => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
</select>
```

For each offer call `priceOfferForChannel(workspace, offer.id, selectedChannelId)` and display minimum, sustainable and recommended values with the exact coverage explanations from the spec. Render `Planejamento mensal necessário` when sustainable/recommended values are `null`.

- [ ] **Step 5: Style four pricing metrics responsively**

Preserve the existing cost card and add a `.produto-precos` grid with three columns at wide widths, two at tablet and one at 420px. Recommended price uses accent tokens; unavailable values use `texto-aviso`.

- [ ] **Step 6: Run full verification**

Run: `npm test && npm run lint && npm run build`
Expected: complete suite PASS, lint exits 0, build exits 0.

- [ ] **Step 7: Commit products integration**

```bash
git add src/pages/Produtos.jsx src/styles/Produtos.css src/persistence/workspace.js src/persistence/workspace.test.js src/persistence/migration.js
git commit -m "feat: exibe referencias de preco por canal"
```

### Task 5: Review and delivery

**Files:**
- Review: all files changed since `1803766`.

**Interfaces:**
- Consumes: completed Tasks 1-4.
- Produces: reviewed and publishable branch.

- [ ] **Step 1: Request independent code review**

Compare base `1803766` to the current HEAD against this plan and `docs/superpowers/specs/2026-08-25-canais-precificacao-design.md`. Fix every Critical or Important finding with a regression test when behavior changes.

- [ ] **Step 2: Run fresh final verification**

Run: `npm test && npm run lint && npm run build`
Expected: all tests pass, lint exits 0 and build exits 0 with production assets listed.

- [ ] **Step 3: Confirm clean Git state**

Run: `git diff --check && git status --short && git log -1 --oneline`
Expected: no diff errors, no uncommitted files and the latest feature commit displayed.

- [ ] **Step 4: Finish the branch**

Use `superpowers:finishing-a-development-branch` to offer merge, Pull Request or branch preservation. Do not delete the worktree after a Pull Request because it remains available for review feedback.
