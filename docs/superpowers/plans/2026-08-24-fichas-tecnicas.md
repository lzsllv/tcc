# Fichas Técnicas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir criar e editar produtos e serviços com ficha técnica baseada nos insumos persistidos, calculando custo de materiais, mão de obra e custo unitário.

**Architecture:** Casos de uso puros gerenciam ofertas no workspace e validam componentes. A tela React edita a oferta e apenas apresenta resultados calculados pelo domínio financeiro, persistindo entradas pelo `WorkspaceService` já integrado ao contexto.

**Tech Stack:** React 19, React Router 7, JavaScript ESM, CSS, Node Test Runner, Vite.

**Spec:** `docs/superpowers/specs/2026-08-24-precificacao-completa-design.md`

## Global Constraints

- Valores monetários permanecem inteiros em centavos e percentuais em pontos-base.
- Conversões só podem ocorrer dentro da mesma família de unidades.
- Cálculos derivados não são persistidos como fonte de verdade.
- Manter React, Vite, React Router, CSS e a identidade visual atual.
- Não adicionar backend, dependências ou histórico de vendas.

---

### Task 1: Casos de uso de ofertas e fichas técnicas

**Files:**
- Create: `src/application/offers.js`
- Create: `src/application/offers.test.js`

**Interfaces:**
- Consumes: `getUnitFamily(unit)`, workspace v2 e `workspace.ingredients`.
- Produces: `createOffer(workspace, input, options)`, `updateOffer(workspace, offerId, input, now)`, `archiveOffer(workspace, offerId, now)` e `deleteOffer(workspace, offerId, now)`.

- [ ] **Step 1: Escrever testes que criem produto e serviço, preservem imutabilidade e normalizem os campos.**

```js
const updated = createOffer(workspace, {
  kind: 'product', name: 'Bolo', category: 'Bolos', batchYield: 10,
  batchTimeMinutes: 60, expectedMonthlySales: 20, desiredMarginBps: null,
  components: [{ ingredientId: 'flour', quantity: 500, unit: 'g', wasteBps: 500 }],
}, { id: 'offer-1', componentIds: ['component-1'], now: NOW });
assert.equal(updated.offers[0].components[0].id, 'component-1');
```

- [ ] **Step 2: Executar o teste isolado e confirmar falha por módulo ausente.**

Run: `node --test src/application/offers.test.js`
Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implementar validações de tipo, nome, rendimento, tempo, vendas, margem, componentes, insumo ativo e compatibilidade de unidade.**

```js
export function createOffer(workspace, input, options = {}) {
  const normalized = normalizeOfferInput(workspace, input, options.componentIds);
  const now = options.now ?? new Date().toISOString();
  return { ...workspace, offers: [...workspace.offers, {
    id: options.id ?? crypto.randomUUID(), ownerId: workspace.ownerId,
    ...normalized, active: true, createdAt: now, updatedAt: now,
  }], updatedAt: now };
}
```

- [ ] **Step 4: Executar testes isolados e suíte completa.**

Run: `node --test src/application/offers.test.js && npm test`
Expected: PASS sem falhas.

- [ ] **Step 5: Commitar os casos de uso.**

```bash
git add src/application/offers.js src/application/offers.test.js
git commit -m "feat: adiciona casos de uso de fichas tecnicas"
```

### Task 2: Editor de ficha técnica

**Files:**
- Create: `src/pages/FichaTecnica.jsx`
- Create: `src/styles/FichaTecnica.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `workspace`, `workspaceStatus`, `atualizarWorkspace`, casos de uso da Task 1 e `calculateOfferVariableCost`.
- Produces: rotas `/produtos/novo` e `/produtos/:id/editar`.

- [ ] **Step 1: Criar editor com identificação, tipo, componentes, produção e resumo calculado.**

```jsx
const cost = calculateOfferVariableCost(draft, ingredientsById, workspace.settings.laborHourCents);
<strong>{formatCents(cost.unitCostCents)}</strong>
```

- [ ] **Step 2: Limitar o seletor a insumos ativos, sugerir unidade compatível e permitir perda de 0% a 100%.**

```jsx
<select value={component.ingredientId} onChange={event => selectIngredient(index, event.target.value)}>
  {activeIngredients.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
</select>
```

- [ ] **Step 3: Persistir via `createOffer` ou `updateOffer`, apresentar salvando, sucesso e erro e navegar para `/produtos`.**

```js
await atualizarWorkspace(current => editingId
  ? updateOffer(current, editingId, payload)
  : createOffer(current, payload));
```

- [ ] **Step 4: Registrar as duas rotas protegidas em `src/App.jsx`.**

- [ ] **Step 5: Executar lint e build.**

Run: `npm run lint && npm run build`
Expected: ambos com exit code 0.

### Task 3: Listagem de produtos e serviços

**Files:**
- Replace: `src/pages/Produtos.jsx`
- Modify: `src/styles/Produtos.css`

**Interfaces:**
- Consumes: `workspace.offers`, `calculateOfferVariableCost`, `archiveOffer`, `deleteOffer`.
- Produces: lista pesquisável com filtro por tipo, custo unitário e ações de criar, editar, arquivar e excluir.

- [ ] **Step 1: Substituir a lista legada por uma visualização do workspace com estados de carregamento, vazio e erro.**

```jsx
const offers = (workspace?.offers ?? []).filter(matchesSearch).filter(matchesKind);
```

- [ ] **Step 2: Adicionar ações de edição, arquivamento e exclusão e manter ofertas arquivadas identificadas.**

- [ ] **Step 3: Exibir custo de materiais, mão de obra e custo unitário calculados em tempo real.**

- [ ] **Step 4: Verificar navegação responsiva e foco dos controles em 320px, 768px, 1024px e largura ampla.**

- [ ] **Step 5: Executar verificação final e commit.**

Run: `npm test && npm run lint && npm run build`
Expected: todos com exit code 0.

```bash
git add src/App.jsx src/pages/FichaTecnica.jsx src/pages/Produtos.jsx src/styles/FichaTecnica.css src/styles/Produtos.css
git commit -m "feat: adiciona editor e listagem de fichas tecnicas"
```
