# Refatoração Incremental do Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separar responsabilidades concentradas no relatório, na ficha técnica e no provider do Precifique sem alterar comportamento, aparência, rotas ou dados persistidos.

**Architecture:** Os arquivos de rota permanecem como pontos de composição; transformações puras recebem testes diretos e componentes exclusivos ficam em subpastas das respectivas páginas. O provider continua montando o contrato do contexto, mas delega o ciclo de autenticação local a um hook focado.

**Tech Stack:** React 19, React Router 7, JavaScript ESM, Vite 8, Vitest, Testing Library e Node Test Runner.

**Spec:** `docs/superpowers/specs/2026-09-24-refatoracao-incremental-frontend-design.md`

## Global Constraints

- O comportamento observável deve permanecer idêntico.
- A API de `useApp()` efetivamente consumida pelas páginas permanecerá compatível.
- Cálculos existentes serão reutilizados, nunca reimplementados em componentes.
- Valores monetários, percentuais e arredondamentos manterão os resultados atuais.
- Backend e alterações preexistentes ou concorrentes permanecerão fora dos commits.
- Não alterar rotas, textos, CSS, responsividade, autenticação, chaves de armazenamento ou formatos persistidos.
- Não instalar nem atualizar dependências.
- Cada commit deve usar staging explícito dos arquivos listados na tarefa.

## Review Focus

- Troca de conta durante uma leitura ou gravação pendente deve impedir que o resultado antigo atualize a conta nova; coberto na Task 4.
- Oferta com margem vazia, vírgula decimal e componente arquivado deve produzir exatamente o payload atual; coberto na Task 3.
- Relatório com quantidade mensal vazia ou textual deve manter os mesmos totais numéricos; coberto na Task 2.
- Relatório sem identidade, produtos ou custos deve manter alertas, links e estados vazios; coberto na Task 2.
- Recursos candidatos a remoção podem ser referenciados fora de imports JavaScript; HTML, CSS e toda a árvore do frontend serão pesquisados na Task 5.

---

### Task 1: Fixar os contratos observáveis

**Files:**
- Modify: `front/src/context/AppContext.test.jsx`
- Create: `front/src/pages/Relatorio.test.jsx`
- Create: `front/src/pages/FichaTecnica.test.jsx`

**Interfaces:**
- Consumes: `AppProvider`, `useApp`, `Relatorio`, `FichaTecnica` e as rotas atuais.
- Produces: testes de caracterização que protegem o contrato do contexto e a marcação essencial das duas páginas.

- [ ] **Step 1: Registrar as chaves realmente expostas pelo contexto**

Adicionar um probe que publique `Object.keys(useApp()).sort()` e um teste com a lista atual completa:

```jsx
function ContractProbe() {
  return <output data-testid="contract">{JSON.stringify(Object.keys(useApp()).sort())}</output>;
}

test('expõe o contrato de contexto usado pelo frontend', async () => {
  render(<AppProvider><ContractProbe /></AppProvider>);
  const keys = JSON.parse(screen.getByTestId('contract').textContent);
  expect(keys).toEqual([
    'adicionarProduto', 'atualizarWorkspace', 'authStatus', 'cadastrar',
    'calcularCustoTotal', 'calcularLucroMensal', 'calcularPrecoSugerido',
    'carregarDemo', 'configuracoes', 'custoFixoPorProduto',
    'custoFixoPorUnidade', 'custosFixos', 'editarProduto',
    'excluirProduto', 'exportarWorkspace', 'login', 'logout',
    'podeCarregarDemo', 'produtos', 'salvarConfiguracoes',
    'salvarCustosFixos', 'setConfiguracoes', 'setCustosFixos',
    'totalCustosFixos', 'totalUnidadesMes', 'usuarioLogado', 'workspace',
    'workspaceError', 'workspaceStatus',
  ].sort());
});
```

- [ ] **Step 2: Caracterizar o relatório sem alterar seu código**

Em `Relatorio.test.jsx`, mockar `useApp`, envolver a página em `MemoryRouter` e comprovar os valores derivados e estados vazios:

```jsx
vi.mock('../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../components/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

test('mantém totais, avisos e linhas da projeção', () => {
  useApp.mockReturnValue({
    produtos: [{ id: 'p1', nome: 'Bolo', categoria: 'Doces', custo: 10, quantidadeMes: '2' }],
    custosFixos: { aluguel: 100, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
    configuracoes: { nomeNegocio: 'Ateliê', logoNegocio: '', regiaoAtuacao: 'SP', margemLucro: 20, custoHora: 15 },
    totalCustosFixos: () => 100,
    totalUnidadesMes: () => 2,
    custoFixoPorUnidade: () => 50,
    calcularCustoTotal: () => 60,
    calcularPrecoSugerido: () => 75,
  });
  render(<MemoryRouter><Relatorio /></MemoryRouter>);
  expect(screen.getByText('R$ 150,00')).toBeTruthy();
  expect(screen.getAllByText('R$ 30,00').length).toBeGreaterThan(0);
  expect(screen.getByText('Bolo')).toBeTruthy();
});
```

- [ ] **Step 3: Caracterizar os estados de rota da ficha técnica**

Em `FichaTecnica.test.jsx`, mockar `useApp` e cobrir carregamento, ID inexistente e editor de criação:

```jsx
test('preserva carregamento e oferta inexistente', () => {
  useApp.mockReturnValue({ workspaceStatus: 'loading' });
  const { unmount } = render(
    <MemoryRouter initialEntries={['/produtos/item-a/editar']}>
      <Routes><Route path="/produtos/:id/editar" element={<FichaTecnica />} /></Routes>
    </MemoryRouter>,
  );
  expect(screen.getByText('Carregando ficha técnica...')).toBeTruthy();

  unmount();
  useApp.mockReturnValue({ workspaceStatus: 'ready', workspace: { offers: [] } });
  render(
    <MemoryRouter initialEntries={['/produtos/item-a/editar']}>
      <Routes><Route path="/produtos/:id/editar" element={<FichaTecnica />} /></Routes>
    </MemoryRouter>,
  );
  expect(screen.getByText('Ficha técnica não encontrada.')).toBeTruthy();
});
```

- [ ] **Step 4: Executar os testes de caracterização**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/context/AppContext.test.jsx src/pages/Relatorio.test.jsx src/pages/FichaTecnica.test.jsx`

Expected: todos os testes aprovados sem alterar arquivos de produção.

- [ ] **Step 5: Commitar apenas os testes**

```powershell
git add front/src/context/AppContext.test.jsx front/src/pages/Relatorio.test.jsx front/src/pages/FichaTecnica.test.jsx
git diff --cached --check
git commit -m "test: characterize frontend refactor boundaries"
```

### Task 2: Separar projeção e apresentação do relatório

**Files:**
- Create: `front/src/pages/relatorio/reportProjection.js`
- Create: `front/src/pages/relatorio/reportProjection.test.js`
- Create: `front/src/pages/relatorio/ReportHeader.jsx`
- Create: `front/src/pages/relatorio/ReportSummary.jsx`
- Create: `front/src/pages/relatorio/FixedCostsTable.jsx`
- Create: `front/src/pages/relatorio/ProductionProjectionTable.jsx`
- Modify: `front/src/pages/Relatorio.jsx`
- Test: `front/src/pages/Relatorio.test.jsx`

**Interfaces:**
- Consumes: produtos e funções `calcularCustoTotal` e `calcularPrecoSugerido` já expostas pelo contexto.
- Produces: `createReportProjection(products, totalFixedCosts, totalMonthlyUnits, fixedCostPerUnit, totalProductCost, suggestedPrice)` e quatro componentes de apresentação sem acesso ao contexto.

- [ ] **Step 1: Escrever testes da projeção pura**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createReportProjection } from './reportProjection.js';

test('calcula receita e lucro preservando quantidades textuais ou vazias', () => {
  const products = [
    { id: 'a', quantidadeMes: '2' },
    { id: 'b', quantidadeMes: '' },
  ];
  const projection = createReportProjection(
    products, () => 100, () => 2, () => 50,
    product => product.id === 'a' ? 60 : 20,
    product => product.id === 'a' ? 75 : 30,
  );
  assert.deepEqual(projection, {
    totalCosts: 100,
    totalUnits: 2,
    fixedCostPerUnit: 50,
    zeroCosts: false,
    totalRevenue: 150,
    totalProfit: 30,
  });
});
```

- [ ] **Step 2: Confirmar falha pelo módulo ausente**

Run: `cd C:\TCC\tcc\front; node --test src/pages/relatorio/reportProjection.test.js`

Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implementar a projeção pura**

```js
export function createReportProjection(
  products,
  totalFixedCosts,
  totalMonthlyUnits,
  fixedCostPerUnit,
  totalProductCost,
  suggestedPrice,
) {
  const totalCosts = totalFixedCosts();
  const totalUnits = totalMonthlyUnits();
  const unitFixedCost = fixedCostPerUnit();
  const totalRevenue = products.reduce((total, product) => (
    total + suggestedPrice(product) * Number(product.quantidadeMes || 0)
  ), 0);
  const totalProfit = products.reduce((total, product) => {
    const unitProfit = suggestedPrice(product) - totalProductCost(product);
    return total + unitProfit * Number(product.quantidadeMes || 0);
  }, 0);
  return {
    totalCosts,
    totalUnits,
    fixedCostPerUnit: unitFixedCost,
    zeroCosts: totalCosts === 0,
    totalRevenue,
    totalProfit,
  };
}
```

- [ ] **Step 4: Extrair componentes sem modificar a marcação interna**

Usar estas interfaces e mover para cada componente o bloco JSX correspondente, preservando classes, textos, links, ordem e elementos:

```jsx
export function ReportHeader({ businessName, logo, region, monthName, year }) {}
export function ReportSummary({ totalRevenue, totalProfit, totalCosts, settings, productCount, formatMoney }) {}
export function FixedCostsTable({ costs, zeroCosts, totalCosts, costNames, formatMoney }) {}
export function ProductionProjectionTable({ products, zeroCosts, totalCosts, totalUnits, fixedCostPerUnit, totalProfit, totalProductCost, suggestedPrice, formatMoney }) {}
```

`ReportHeader` e as tabelas importarão `Link` ou ícones diretamente apenas quando o bloco original já os utilizava. Nenhum componente importará `useApp`.

- [ ] **Step 5: Reduzir `Relatorio.jsx` à coordenação**

Manter `MESES`, seleção de mês/ano, botão de impressão e alertas na rota. Substituir cálculos locais por:

```js
const projection = createReportProjection(
  produtos,
  totalCustosFixos,
  totalUnidadesMes,
  custoFixoPorUnidade,
  calcularCustoTotal,
  calcularPrecoSugerido,
);
```

Compor os quatro componentes usando os valores de `projection`, sem wrappers adicionais.

- [ ] **Step 6: Executar testes focados e verificar a ausência de contexto nos componentes**

Run: `cd C:\TCC\tcc\front; node --test src/pages/relatorio/reportProjection.test.js`

Expected: PASS.

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/pages/Relatorio.test.jsx`

Expected: PASS.

Run: `cd C:\TCC\tcc; rg -n "useApp|AppContext" front/src/pages/relatorio`

Expected: nenhuma ocorrência.

- [ ] **Step 7: Executar a matriz do frontend e commit**

Run: `cd C:\TCC\tcc\front; npm test && npm run lint && npm run build`

Expected: 140 testes Node, testes Vitest incluindo `Relatorio.test.jsx`, lint e build aprovados.

```powershell
git add front/src/pages/Relatorio.jsx front/src/pages/Relatorio.test.jsx front/src/pages/relatorio
git diff --cached --check
git commit -m "refactor: separate report composition"
```

### Task 3: Separar transformações e seções da ficha técnica

**Files:**
- Create: `front/src/pages/ficha-tecnica/offerForm.js`
- Create: `front/src/pages/ficha-tecnica/offerForm.test.js`
- Create: `front/src/pages/ficha-tecnica/OfferIdentificationSection.jsx`
- Create: `front/src/pages/ficha-tecnica/OfferCompositionSection.jsx`
- Create: `front/src/pages/ficha-tecnica/OfferProductionSection.jsx`
- Create: `front/src/pages/ficha-tecnica/OfferCostSummary.jsx`
- Modify: `front/src/pages/FichaTecnica.jsx`
- Test: `front/src/pages/FichaTecnica.test.jsx`

**Interfaces:**
- Consumes: oferta persistida, formulário atual, `percentToBps`, ingredientes e callbacks do editor.
- Produces: `EMPTY_OFFER_FORM`, `numberFromInput`, `offerToForm` e `formToOfferInput`; quatro componentes sem acesso ao contexto ou persistência.

- [ ] **Step 1: Escrever testes das transformações**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_OFFER_FORM, formToOfferInput, offerToForm } from './offerForm.js';

test('converte oferta persistida para o formulário sem mutar a entrada', () => {
  const offer = {
    kind: 'product', name: 'Bolo', category: 'Doces', batchYield: 10,
    batchTimeMinutes: 90, expectedMonthlySales: 20, desiredMarginBps: 1250,
    components: [{ id: 'c1', ingredientId: 'i1', quantity: 500, unit: 'g', wasteBps: 250 }],
  };
  assert.equal(offerToForm(offer).desiredMargin, '12,5');
  assert.equal(offerToForm(offer).components[0].waste, '2,5');
  assert.equal(offer.components[0].quantity, 500);
});

test('monta o payload atual para produto e serviço', () => {
  const product = formToOfferInput({
    ...EMPTY_OFFER_FORM,
    name: 'Bolo', category: 'Doces', batchYield: '10', batchTimeMinutes: '90',
    expectedMonthlySales: '20', desiredMargin: '12,5',
    components: [{ id: 'c1', ingredientId: 'i1', quantity: '500,5', unit: 'g', waste: '2,5' }],
  });
  assert.deepEqual(product, {
    kind: 'product', name: 'Bolo', category: 'Doces', batchYield: 10,
    batchTimeMinutes: 90, expectedMonthlySales: 20, desiredMarginBps: 1250,
    components: [{ id: 'c1', ingredientId: 'i1', quantity: 500.5, unit: 'g', wasteBps: 250 }],
  });
  assert.equal(formToOfferInput({ ...EMPTY_OFFER_FORM, kind: 'service' }).batchYield, 1);
});
```

- [ ] **Step 2: Confirmar falha pelo módulo ausente**

Run: `cd C:\TCC\tcc\front; node --test src/pages/ficha-tecnica/offerForm.test.js`

Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implementar transformações puras**

```js
import { percentToBps } from '../../domain/pricing/money.js';

export const EMPTY_OFFER_FORM = {
  kind: 'product', name: '', category: '', batchYield: '1', batchTimeMinutes: '',
  expectedMonthlySales: '', desiredMargin: '', components: [],
};

export function numberFromInput(value) {
  return Number(String(value).replace(',', '.'));
}

export function offerToForm(offer) {
  return {
    kind: offer.kind,
    name: offer.name,
    category: offer.category,
    batchYield: String(offer.batchYield),
    batchTimeMinutes: String(offer.batchTimeMinutes),
    expectedMonthlySales: String(offer.expectedMonthlySales),
    desiredMargin: offer.desiredMarginBps === null ? '' : String(offer.desiredMarginBps / 100).replace('.', ','),
    components: offer.components.map(component => ({
      ...component,
      quantity: String(component.quantity),
      waste: String(component.wasteBps / 100).replace('.', ','),
    })),
  };
}

export function formToOfferInput(form) {
  return {
    kind: form.kind,
    name: form.name,
    category: form.category,
    batchYield: form.kind === 'service' ? 1 : numberFromInput(form.batchYield),
    batchTimeMinutes: numberFromInput(form.batchTimeMinutes || 0),
    expectedMonthlySales: numberFromInput(form.expectedMonthlySales || 0),
    desiredMarginBps: form.desiredMargin === '' ? null : percentToBps(form.desiredMargin),
    components: form.components.map(component => ({
      id: component.id,
      ingredientId: component.ingredientId,
      quantity: numberFromInput(component.quantity),
      unit: component.unit,
      wasteBps: percentToBps(component.waste || 0),
    })),
  };
}
```

- [ ] **Step 4: Extrair as quatro seções visuais**

Mover o JSX atual sem alterar classes, textos ou ordem, usando estas interfaces:

```jsx
export function OfferIdentificationSection({ form, onChange, onKindChange }) {}
export function OfferCompositionSection({ form, ingredientsById, selectableIngredients, onAdd, onUpdate, onRemove }) {}
export function OfferProductionSection({ form, onChange }) {}
export function OfferCostSummary({ form, preview, saving, editing }) {}
```

`OfferCompositionSection` importará `Plus`, `Trash`, `calculateIngredientCost`, `formatCents`, `percentToBps`, `getUnitFamily` e `numberFromInput`. `OfferCostSummary` importará `Link` e `formatCents`. Nenhum componente importará `useApp`, `createOffer`, `updateOffer` ou repositórios.

- [ ] **Step 5: Reduzir o editor à coordenação**

Substituir `EMPTY_FORM`, `offerToForm`, `numberFromInput` e montagem inline do payload pelos exports de `offerForm.js`:

```js
const [form, setForm] = useState(() => existing ? offerToForm(existing) : EMPTY_OFFER_FORM);

async function submit(event) {
  event.preventDefault();
  setMessage('');
  try {
    const payload = formToOfferInput(form);
    await atualizarWorkspace(current => id
      ? updateOffer(current, id, payload)
      : createOffer(current, payload));
    navigate('/produtos', { replace: true, state: { saved: true } });
  } catch (error) {
    setMessage(error.message);
  }
}
```

Compor as quatro seções dentro do mesmo `<form className="ficha-layout">`, sem wrappers novos.

- [ ] **Step 6: Executar testes focados e regras de dependência**

Run: `cd C:\TCC\tcc\front; node --test src/pages/ficha-tecnica/offerForm.test.js`

Expected: PASS.

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/pages/FichaTecnica.test.jsx`

Expected: PASS.

Run: `cd C:\TCC\tcc; rg -n "useApp|LocalWorkspaceRepository|createOffer|updateOffer" front/src/pages/ficha-tecnica`

Expected: nenhuma ocorrência, exceto imports de `useApp`, `createOffer` e `updateOffer` no arquivo de rota fora da subpasta.

- [ ] **Step 7: Executar a matriz do frontend e commit**

Run: `cd C:\TCC\tcc\front; npm test && npm run lint && npm run build`

Expected: 142 testes Node, todos os testes Vitest, lint e build aprovados.

```powershell
git add front/src/pages/FichaTecnica.jsx front/src/pages/FichaTecnica.test.jsx front/src/pages/ficha-tecnica
git diff --cached --check
git commit -m "refactor: separate offer editor composition"
```

### Task 4: Isolar o ciclo de autenticação local

**Files:**
- Create: `front/src/context/useLocalSession.js`
- Modify: `front/src/context/AppProvider.jsx`
- Modify: `front/src/context/AppContext.test.jsx`

**Interfaces:**
- Consumes: `authServiceFactory` e callback `onIdentityChanged(user)`.
- Produces: `useLocalSession({ authServiceFactory, onIdentityChanged })`, retornando `{ usuarioLogado, authStatus, login, cadastrar, logout }`.

- [ ] **Step 1: Adicionar teste de evento tardio da sessão anterior**

Criar uma factory controlável e testar que um resultado assíncrono antigo não substitui a conta atual:

```jsx
test('ignora restauração tardia depois de receber um evento de autenticação', async () => {
  let resolveSession;
  let subscriber;
  const authService = {
    getSession: () => new Promise(resolve => { resolveSession = resolve; }),
    subscribe: callback => { subscriber = callback; return () => {}; },
    signIn: vi.fn(), signUp: vi.fn(), signOut: vi.fn(),
  };
  render(<AppProvider authServiceFactory={() => authService}><Probe /></AppProvider>);
  await act(async () => subscriber({ user: { id: 'user-new', name: 'Nova' } }));
  await act(async () => resolveSession({ user: { id: 'user-old', name: 'Antiga' } }));
  await waitFor(() => expect(state().user).toBe('user-new'));
});
```

- [ ] **Step 2: Executar o teste e confirmar que protege o comportamento atual**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/context/AppContext.test.jsx`

Expected: PASS antes da extração.

- [ ] **Step 3: Implementar `useLocalSession` preservando a ordem atual**

```js
import { useEffect, useState } from 'react';
import { sessionUser } from '../auth/session.js';

export function useLocalSession({ authServiceFactory, onIdentityChanged }) {
  const [authService] = useState(() => authServiceFactory());
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    const accept = session => {
      const user = sessionUser(session);
      onIdentityChanged(user);
      setUsuarioLogado(previous => previous?.id === user?.id ? previous : user);
    };
    authService.getSession()
      .then(session => { if (active && !receivedAuthEvent) accept(session); })
      .catch(() => { if (active && !receivedAuthEvent) accept(null); })
      .finally(() => { if (active) setAuthStatus('ready'); });
    const unsubscribe = authService.subscribe(session => {
      if (active) {
        receivedAuthEvent = true;
        accept(session);
        setAuthStatus('ready');
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [authService, onIdentityChanged]);

  return {
    usuarioLogado,
    authStatus,
    login: async (email, senha) => { await authService.signIn(email, senha); return true; },
    cadastrar: (nome, email, senha) => authService.signUp(nome, email, senha),
    logout: () => authService.signOut(),
  };
}
```

- [ ] **Step 4: Integrar o hook ao provider**

Manter `sessionScope`, `workspaceService`, reducer e visões no provider. Renomear `acceptSession` para `acceptIdentity` e fazê-lo receber `user`:

```js
const acceptIdentity = useCallback((user) => {
  const ownerId = user?.id ?? null;
  if (sessionScope.current.ownerId !== ownerId) {
    sessionScope.current = { ownerId };
    setWorkspaceService(ownerId
      ? new WorkspaceService(workspaceRepositoryFactory(localStorage), localStorage)
      : null);
    dispatchWorkspace({ type: 'reset' });
    clearLegacyView();
  }
}, [clearLegacyView, workspaceRepositoryFactory]);

const { usuarioLogado, authStatus, login, cadastrar, logout } = useLocalSession({
  authServiceFactory,
  onIdentityChanged: acceptIdentity,
});
```

Remover do provider apenas os estados, efeito e wrappers de autenticação transferidos. No cleanup do provider, preservar a invalidação de `sessionScope.current` por um efeito dedicado.

- [ ] **Step 5: Executar testes de sessão e integração**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/context/AppContext.test.jsx src/App.local.test.jsx src/app/AppRoutes.test.jsx`

Expected: restauração, evento tardio, troca de conta, logout, rotas e fluxo local aprovados.

Run: `cd C:\TCC\tcc\front; npm test && npm run lint && npm run build`

Expected: todas as verificações aprovadas.

- [ ] **Step 6: Commitar a extração**

```powershell
git add front/src/context/useLocalSession.js front/src/context/AppProvider.jsx front/src/context/AppContext.test.jsx
git diff --cached --check
git commit -m "refactor: isolate local session lifecycle"
```

### Task 5: Remover somente artefatos comprovadamente sem uso

**Files:**
- Modify: `front/src/context/AppProvider.jsx`
- Modify: `front/src/context/AppContext.test.jsx`
- Delete: `front/src/assets/hero.png`
- Delete: `front/src/assets/react.svg`
- Delete: `front/src/assets/vite.svg`

**Interfaces:**
- Consumes: contrato caracterizado na Task 1 e toda a árvore versionada do frontend.
- Produces: contrato do contexto sem mutadores não persistentes e árvore sem assets de template não referenciados.

- [ ] **Step 1: Repetir buscas de consumidores**

Run:

```powershell
cd C:\TCC\tcc
rg -n "adicionarProduto|editarProduto|excluirProduto" front/src --glob '!context/AppProvider.jsx' --glob '!context/AppContext.test.jsx'
rg -n "hero\.png|react\.svg|vite\.svg" front index.html --glob '!src/assets/hero.png' --glob '!src/assets/react.svg' --glob '!src/assets/vite.svg'
```

Expected: nenhuma ocorrência. Se houver consumidor, interromper a remoção daquele item e registrar o arquivo encontrado.

- [ ] **Step 2: Atualizar o teste do contrato antes da remoção**

Remover da lista esperada apenas:

```js
'adicionarProduto',
'editarProduto',
'excluirProduto',
```

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/context/AppContext.test.jsx`

Expected: FAIL mostrando as três propriedades extras.

- [ ] **Step 3: Remover os mutadores e assets**

Excluir as três funções do provider e suas três entradas no valor do contexto. Remover somente os três arquivos de imagem confirmados pela busca.

- [ ] **Step 4: Executar verificação integral**

Run: `cd C:\TCC\tcc\front; npm test && npm run lint && npm run build`

Expected: todos os testes, lint e build aprovados; o bundle não referencia os arquivos removidos.

- [ ] **Step 5: Commitar a limpeza**

```powershell
git add front/src/context/AppProvider.jsx front/src/context/AppContext.test.jsx
git add -u -- front/src/assets/hero.png front/src/assets/react.svg front/src/assets/vite.svg
git diff --cached --check
git commit -m "refactor: remove unused frontend artifacts"
```

### Task 6: Auditar páginas moderadas e validar a entrega

**Files:**
- Review: `front/src/pages/Insumos.jsx`
- Review: `front/src/pages/CanaisVenda.jsx`
- Review: todos os arquivos modificados nas Tasks 1–5

**Interfaces:**
- Consumes: frontend refatorado e spec aprovada.
- Produces: evidência final de equivalência, ausência de ciclos e preservação do escopo.

- [ ] **Step 1: Auditar `Insumos.jsx` e `CanaisVenda.jsx`**

Confirmar, para cada página, se formulário e listagem compartilham o mesmo estado de edição e mensagens. Como compartilham hoje, mantê-las inteiras a menos que a auditoria encontre uma unidade independente com interface menor que cinco propriedades. Registrar no relatório final que nenhuma divisão foi feita quando o benefício não superar a fragmentação.

- [ ] **Step 2: Verificar direção de dependências**

Run:

```powershell
cd C:\TCC\tcc
rg -n "useApp|AppContext|LocalWorkspaceRepository|WorkspaceService" front/src/pages/relatorio front/src/pages/ficha-tecnica
rg -n "pages/|pages\\" front/src/components front/src/domain front/src/application front/src/persistence front/src/auth
```

Expected: componentes de página sem contexto/persistência e camadas internas sem dependência de páginas.

- [ ] **Step 3: Verificar ciclos com um script temporário fora do repositório**

Executar um script PowerShell em memória que leia imports relativos de `.js` e `.jsx`, resolva extensões e faça busca em profundidade. O comando deve encerrar com código 1 e imprimir o caminho se encontrar um ciclo; caso contrário deve imprimir `No cycles`.

Expected: `No cycles` para `front/src`.

- [ ] **Step 4: Comparar contratos protegidos**

Run:

```powershell
cd C:\TCC\tcc
git diff ecefd74a..HEAD -- front/src/app/AppRoutes.jsx front/src/styles front/src/auth front/src/persistence front/src/domain front/package.json front/package-lock.json
git diff --name-only ecefd74a..HEAD -- backend
```

Expected: nenhuma alteração em rotas, CSS, autenticação, persistência, domínio, dependências ou backend.

- [ ] **Step 5: Executar a matriz final**

Run:

```powershell
cd C:\TCC\tcc\front
npm test
npm run lint
npm run build
cd C:\TCC\tcc
git diff --check ecefd74a..HEAD
```

Expected: todos os testes aprovados, lint sem erros, build com exit code zero e nenhum erro de whitespace.

- [ ] **Step 6: Validar manualmente no navegador**

Executar `npm run dev` e verificar em larguras de 320, 768, 1024 e 1440 pixels:

1. cadastro, logout, login e restauração;
2. dashboard e navegação protegida;
3. criação e edição de insumo;
4. criação e edição de ficha técnica;
5. produtos, custos fixos e canais;
6. simulação e relatório, incluindo impressão;
7. configurações e logo;
8. demonstração e exportação.

Registrar separadamente qualquer jornada que dependa de interação humana ou recurso indisponível; não declará-la aprovada sem execução.

- [ ] **Step 7: Inspecionar commits e working tree**

Run:

```powershell
cd C:\TCC\tcc
git log --oneline ecefd74a..HEAD
git status --short
```

Expected: commits pequenos da refatoração; exclusões preexistentes de documentação podem continuar no working tree, mas não aparecem nos commits da implementação.
