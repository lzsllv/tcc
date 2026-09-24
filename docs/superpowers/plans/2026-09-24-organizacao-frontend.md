# Professional Frontend Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar o frontend do Precifique em módulos focados e remover comentários de código sem alterar comportamento, interface ou dados persistidos.

**Architecture:** `App.jsx` ficará como ponto de composição, `app/AppRoutes.jsx` concentrará navegação e o contexto será dividido entre contrato, provider, estados iniciais e cálculos puros. As camadas de domínio, aplicação, autenticação e persistência serão preservadas, assim como a API pública de `useApp`.

**Tech Stack:** React 19, React Router 7, JavaScript ES modules, Node test runner, Vitest, Testing Library, ESLint 10 e Vite 8.

**Spec:** `docs/superpowers/specs/2026-09-24-organizacao-frontend-design.md`

## Global Constraints

- Nenhum fluxo funcional será adicionado, removido ou alterado.
- Nenhum texto visível, estilo, rota ou formato persistido será alterado.
- Nenhuma dependência será adicionada.
- O login, a sessão e os workspaces continuarão locais ao navegador.
- A API pública exposta por `useApp` permanecerá compatível com todas as páginas atuais.
- Arquivos de código não conterão comentários de observação, documentação, seção ou processo.
- URLs, expressões regulares, strings, data URLs e conteúdo SVG que contenham barras serão preservados.
- O backend e suas alterações pendentes permanecerão fora do escopo.

## Review Focus

- Duas chamadas das fábricas de estado vazio devem produzir objetos e listas `extras` independentes; coberto na Task 1.
- Valores numéricos recebidos como strings devem manter os mesmos totais e preços; coberto na Task 1.
- Margem igual ou superior a 100% deve continuar retornando preço sugerido zero; coberto na Task 1.
- Rotas protegidas sem sessão devem aguardar a restauração e redirecionar para login; coberto na Task 3.
- A remoção de comentários não pode modificar URLs, data URLs, regex ou glob patterns; coberto na Task 4 pela suíte integral, build e buscas específicas.

---

### Task 1: Extrair estados iniciais e cálculos de apresentação

**Files:**
- Create: `front/src/context/appDefaults.js`
- Create: `front/src/context/appDefaults.test.js`
- Create: `front/src/context/pricingView.js`
- Create: `front/src/context/pricingView.test.js`
- Modify: `front/src/context/AppContext.jsx`

**Interfaces:**
- Consumes: arrays de produtos e objetos de custos/configurações já usados por `AppContext`.
- Produces: `createEmptyFixedCostsView()`, `createEmptySettingsView()` e `createPricingView(products, fixedCosts, settings)`.

- [ ] **Step 1: Escrever os testes das fábricas e cálculos**

Criar `appDefaults.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyFixedCostsView, createEmptySettingsView } from './appDefaults.js';

test('cria estados vazios independentes', () => {
  const firstCosts = createEmptyFixedCostsView();
  const secondCosts = createEmptyFixedCostsView();
  firstCosts.extras.push({ id: 'extra' });

  assert.deepEqual(secondCosts, {
    aluguel: 0,
    energia: 0,
    internet: 0,
    salarios: 0,
    outros: 0,
    extras: [],
  });
  assert.notEqual(firstCosts, secondCosts);
  assert.notEqual(firstCosts.extras, secondCosts.extras);
  assert.deepEqual(createEmptySettingsView(), {
    margemLucro: 20,
    custoHora: 0,
    regiaoAtuacao: '',
    nomeNegocio: '',
    logoNegocio: '',
  });
});
```

Criar `pricingView.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createPricingView } from './pricingView.js';

test('preserva totais e preços com valores numéricos ou textuais', () => {
  const pricing = createPricingView(
    [{ custo: '10', tempoProducao: '2', quantidadeMes: '5' }],
    { aluguel: '100', energia: 0, internet: 0, salarios: 0, outros: 0, extras: [{ valor: '50' }] },
    { custoHora: '20', margemLucro: '20' },
  );

  assert.equal(pricing.totalFixedCosts(), 150);
  assert.equal(pricing.totalMonthlyUnits(), 5);
  assert.equal(pricing.fixedCostPerUnit(), 30);
  assert.equal(pricing.fixedCostPerProduct(), 150);
  assert.equal(pricing.totalProductCost({ custo: '10', tempoProducao: '2' }), 80);
  assert.equal(pricing.suggestedPrice({ custo: '10', tempoProducao: '2' }), 100);
  assert.equal(pricing.monthlyProfit(100, 80, 5), 100);
});

test('preserva os limites para listas vazias e margem inviável', () => {
  const empty = createPricingView([], { extras: [] }, { custoHora: 0, margemLucro: 100 });
  assert.equal(empty.totalMonthlyUnits(), 1);
  assert.equal(empty.fixedCostPerProduct(), 0);
  assert.equal(empty.suggestedPrice({ custo: 10, tempoProducao: 0 }), 0);
});
```

- [ ] **Step 2: Executar os testes e confirmar módulos ausentes**

Run: `cd C:\TCC\tcc\front; node --test src/context/appDefaults.test.js src/context/pricingView.test.js`

Expected: FAIL com `ERR_MODULE_NOT_FOUND` para os dois módulos novos.

- [ ] **Step 3: Implementar fábricas e cálculos puros**

Criar `appDefaults.js`:

```js
export function createEmptyFixedCostsView() {
  return { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] };
}

export function createEmptySettingsView() {
  return { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' };
}
```

Criar `pricingView.js`:

```js
export function createPricingView(products, fixedCosts, settings) {
  function totalFixedCosts() {
    const base = Object.entries(fixedCosts)
      .filter(([key]) => key !== 'extras')
      .reduce((total, [, value]) => total + Number(value), 0);
    const extras = (fixedCosts.extras ?? [])
      .reduce((total, extra) => total + Number(extra.valor || 0), 0);
    return base + extras;
  }

  function totalMonthlyUnits() {
    if (!products.length) return 1;
    const total = products.reduce((sum, product) => sum + (Number(product.quantidadeMes) || 0), 0);
    return total > 0 ? total : 1;
  }

  const fixedCostPerUnit = () => totalFixedCosts() / totalMonthlyUnits();
  const fixedCostPerProduct = () => products.length ? totalFixedCosts() / products.length : 0;
  const totalProductCost = product => Number(product.custo || 0)
    + fixedCostPerUnit()
    + Number(settings.custoHora) * Number(product.tempoProducao || 0);

  function suggestedPrice(product) {
    const margin = Number(settings.margemLucro) / 100;
    return margin >= 1 ? 0 : totalProductCost(product) / (1 - margin);
  }

  const monthlyProfit = (salePrice, totalCost, quantity) => (
    (Number(salePrice) - Number(totalCost)) * Number(quantity)
  );

  return {
    totalFixedCosts,
    totalMonthlyUnits,
    fixedCostPerUnit,
    fixedCostPerProduct,
    totalProductCost,
    suggestedPrice,
    monthlyProfit,
  };
}
```

Em `AppContext.jsx`, substituir os objetos iniciais repetidos pelas fábricas e criar `pricing` com `createPricingView(produtos, custosFixos, configuracoes)`. Manter os nomes públicos atuais ao montar o valor do provider:

```js
const pricing = createPricingView(produtos, custosFixos, configuracoes);

const totalCustosFixos = pricing.totalFixedCosts;
const totalUnidadesMes = pricing.totalMonthlyUnits;
const custoFixoPorUnidade = pricing.fixedCostPerUnit;
const custoFixoPorProduto = pricing.fixedCostPerProduct;
const calcularCustoTotal = pricing.totalProductCost;
const calcularPrecoSugerido = pricing.suggestedPrice;
const calcularLucroMensal = pricing.monthlyProfit;
```

- [ ] **Step 4: Executar testes focados e suíte completa**

Run: `cd C:\TCC\tcc\front; node --test src/context/appDefaults.test.js src/context/pricingView.test.js`

Expected: 3 testes aprovados.

Run: `cd C:\TCC\tcc\front; npm test`

Expected: zero falhas.

- [ ] **Step 5: Commitar a extração pura**

```powershell
git add front/src/context/appDefaults.js front/src/context/appDefaults.test.js front/src/context/pricingView.js front/src/context/pricingView.test.js front/src/context/AppContext.jsx
git commit -m "refactor: extract frontend view calculations"
```

### Task 2: Separar contrato do contexto e provider

**Files:**
- Create: `front/src/context/AppContext.js`
- Create: `front/src/context/AppProvider.jsx`
- Delete: `front/src/context/AppContext.jsx`
- Modify: `front/src/App.jsx`
- Modify: `front/src/context/AppContext.test.jsx`
- Modify: `front/src/components/Navbar.jsx`
- Modify: `front/src/pages/Cadastro.jsx`
- Modify: `front/src/pages/CanaisVenda.jsx`
- Modify: `front/src/pages/Configuracoes.jsx`
- Modify: `front/src/pages/CustosFixos.jsx`
- Modify: `front/src/pages/Dashboard.jsx`
- Modify: `front/src/pages/FichaTecnica.jsx`
- Modify: `front/src/pages/Insumos.jsx`
- Modify: `front/src/pages/Login.jsx`
- Modify: `front/src/pages/Produtos.jsx`
- Modify: `front/src/pages/Relatorio.jsx`
- Modify: `front/src/pages/Simulacao.jsx`

**Interfaces:**
- Consumes: funções da Task 1 e serviços locais já existentes.
- Produces: `useApp()` em `AppContext.js` e componente `AppProvider` em `AppProvider.jsx`, mantendo o valor público existente.

- [ ] **Step 1: Alterar o teste do contexto para os novos limites**

Em `AppContext.test.jsx`, substituir:

```js
import { AppProvider, useApp } from './AppContext.jsx';
```

por:

```js
import { useApp } from './AppContext.js';
import { AppProvider } from './AppProvider.jsx';
```

- [ ] **Step 2: Executar o teste e confirmar módulos ausentes**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/context/AppContext.test.jsx`

Expected: FAIL com `ERR_MODULE_NOT_FOUND` para `AppContext.js` ou `AppProvider.jsx`.

- [ ] **Step 3: Criar o contrato do contexto**

Criar `AppContext.js`:

```js
import { createContext, useContext } from 'react';

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}
```

- [ ] **Step 4: Mover o provider mantendo o contrato público**

Criar `AppProvider.jsx` a partir do corpo atual de `AppContext.jsx` e ajustar o início do arquivo para:

```js
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { WorkspaceService } from '../application/WorkspaceService.js';
import { initialWorkspaceState, workspaceReducer } from '../application/workspaceState.js';
import { LocalWorkspaceRepository } from '../persistence/LocalWorkspaceRepository.js';
import { isDemoAccountEmpty, persistDemoAccount } from '../application/demoAccount.js';
import { LocalAuthService } from '../auth/LocalAuthService.js';
import { LocalAccountStore } from '../auth/localAccountStore.js';
import { sessionUser } from '../auth/session.js';
import { AppContext } from './AppContext.js';
import { createEmptyFixedCostsView, createEmptySettingsView } from './appDefaults.js';
import { createPricingView } from './pricingView.js';
import { fixedCostsFromView, workspaceToView } from './workspaceView.js';
```

Preservar `createAuthService`, `createWorkspaceRepository`, `AppProvider`, toda lógica de sessão/workspace, ações públicas e o mesmo objeto entregue a `AppContext.Provider`. Excluir `AppContext.jsx` após os consumidores serem atualizados.

- [ ] **Step 5: Atualizar imports dos consumidores**

Usar `rg -l "context/AppContext" front/src` para localizar consumidores. Páginas e componentes devem importar somente:

```js
import { useApp } from '../context/AppContext.js';
```

Em `App.jsx`, importar:

```js
import { AppProvider } from './context/AppProvider.jsx';
```

- [ ] **Step 6: Executar integração, lint e busca de referências antigas**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/context/AppContext.test.jsx src/App.local.test.jsx`

Expected: todos os testes aprovados.

Run: `cd C:\TCC\tcc\front; npm run lint`

Expected: zero erros sem desativar `react-refresh/only-export-components`.

Run: `cd C:\TCC\tcc; rg -n "AppContext\.jsx|react-refresh/only-export-components" front/src`

Expected: nenhuma ocorrência.

- [ ] **Step 7: Commitar a separação do contexto**

```powershell
git add front/src
git commit -m "refactor: separate app context and provider"
```

### Task 3: Extrair rotas da composição principal

**Files:**
- Create: `front/src/app/AppRoutes.jsx`
- Create: `front/src/app/AppRoutes.test.jsx`
- Modify: `front/src/App.jsx`

**Interfaces:**
- Consumes: `useApp()` de `context/AppContext.js` e páginas existentes.
- Produces: componente `AppRoutes` para uso dentro de qualquer router React Router.

- [ ] **Step 1: Escrever teste das rotas protegidas e da raiz autenticada**

Criar `AppRoutes.test.jsx`:

```jsx
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LocalAccountStore } from '../auth/localAccountStore.js';
import { AppProvider } from '../context/AppProvider.jsx';
import AppRoutes from './AppRoutes.jsx';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

test('redireciona rota protegida para login sem sessão', async () => {
  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>,
  );
  expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeTruthy();
});

test('redireciona a raiz para dashboard com sessão local', async () => {
  const store = new LocalAccountStore(localStorage);
  store.addAccount({ id: 'user-1', name: 'Ana', email: 'ana@example.com' });
  store.setSessionAccountId('user-1');
  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>,
  );
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Olá, Ana' })).toBeTruthy());
});
```

- [ ] **Step 2: Executar o teste e confirmar módulo ausente**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/app/AppRoutes.test.jsx`

Expected: FAIL com `ERR_MODULE_NOT_FOUND` para `AppRoutes.jsx`.

- [ ] **Step 3: Criar o componente de rotas**

Criar `AppRoutes.jsx` com os imports atuais de páginas e estas funções de proteção:

```jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';

function ProtectedRoute({ children }) {
  const { usuarioLogado, authStatus } = useApp();
  if (authStatus === 'loading') return null;
  return usuarioLogado ? children : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { usuarioLogado, authStatus } = useApp();
  if (authStatus === 'loading') return null;
  return usuarioLogado ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}
```

O retorno de `AppRoutes` deve reproduzir exatamente as rotas atuais de `/`, `/login`, `/cadastro`, `/dashboard`, `/produtos`, `/produtos/novo`, `/produtos/:id/editar`, `/insumos`, `/custos-fixos`, `/canais-venda`, `/configuracoes`, `/simulacao`, `/relatorio` e `*`, usando `ProtectedRoute` nas mesmas rotas hoje protegidas.

- [ ] **Step 4: Simplificar `App.jsx`**

Substituir o arquivo pelo ponto de composição:

```jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/AppRoutes.jsx';
import { AppProvider } from './context/AppProvider.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
```

- [ ] **Step 5: Executar testes de rotas e fluxo local**

Run: `cd C:\TCC\tcc\front; npm exec vitest -- run src/app/AppRoutes.test.jsx src/App.local.test.jsx`

Expected: 3 testes aprovados, incluindo cadastro, logout, login e os dois redirecionamentos.

- [ ] **Step 6: Commitar a composição de rotas**

```powershell
git add front/src/App.jsx front/src/app/AppRoutes.jsx front/src/app/AppRoutes.test.jsx
git commit -m "refactor: separate application routes"
```

### Task 4: Remover comentários do código do frontend

**Files:**
- Modify: `front/vite.config.js`
- Modify: `front/src/index.css`
- Modify: `front/src/hooks/useToast.js`
- Modify: `front/src/components/LoadingButton.jsx`
- Modify: `front/src/components/PageTransition.jsx`
- Modify: `front/src/components/Skeleton.jsx`
- Modify: `front/src/pages/CustosFixos.jsx`
- Modify: `front/src/pages/FichaTecnica.jsx`
- Modify: `front/src/pages/Relatorio.jsx`
- Modify: `front/src/pages/Simulacao.jsx`
- Modify: `front/src/styles/Configuracoes.css`
- Modify: `front/src/styles/CustosFixos.css`
- Modify: `front/src/styles/LoadingButton.css`
- Modify: `front/src/styles/PageTransition.css`
- Modify: `front/src/styles/Relatorio.css`
- Modify: `front/src/styles/Select.css`
- Modify: `front/src/styles/Skeleton.css`
- Modify: `front/src/styles/Toast.css`

**Interfaces:**
- Consumes: frontend reorganizado das Tasks 1–3.
- Produces: os mesmos módulos e estilos sem comentários de código.

- [ ] **Step 1: Registrar a busca que comprova os comentários existentes**

Run:

```powershell
rg -n '^\s*//|^\s*/\*|\{\s*/\*|catch\s*\{\s*/\*' front/src front/vite.config.js --glob '*.{js,jsx,css}'
```

Expected: ocorrências em componentes, páginas, estilos, hook e configuração do Vite.

- [ ] **Step 2: Remover comentários sem alterar instruções executáveis**

Remover comentários de linha, bloco, JSDoc, JSX e CSS dos arquivos listados. Em `FichaTecnica.jsx`, substituir:

```js
try {
  cost = calculateIngredientCost(ingredient, numberFromInput(component.quantity), component.unit, percentToBps(component.waste || 0));
} catch {
  cost = 0;
}
```

Isso preserva o valor inicial usado quando os dados ainda são inválidos sem deixar um bloco vazio ou comentário. Não alterar strings com `http://`, `https://`, `data:image/`, regex nem globs como `src/**/*.test.jsx`.

- [ ] **Step 3: Confirmar ausência de comentários**

Run:

```powershell
rg -n '^\s*//|^\s*/\*|\{\s*/\*|catch\s*\{\s*/\*' front/src front/vite.config.js --glob '*.{js,jsx,css}'
```

Expected: nenhuma ocorrência.

Run: `cd C:\TCC\tcc; rg -n "https://vite.dev/config|react-refresh/only-export-components|aguarda dados válidos" front/src front/vite.config.js`

Expected: nenhuma ocorrência.

- [ ] **Step 4: Executar lint e build**

Run: `cd C:\TCC\tcc\front; npm run lint`

Expected: zero erros e zero avisos.

Run: `cd C:\TCC\tcc\front; npm run build`

Expected: exit code 0.

- [ ] **Step 5: Commitar a limpeza**

```powershell
git add front/vite.config.js front/src
git commit -m "style: remove frontend code comments"
```

### Task 5: Revisão e verificação integral

**Files:**
- Review: todos os arquivos alterados nas Tasks 1–4.

**Interfaces:**
- Consumes: frontend completamente reorganizado.
- Produces: evidência de equivalência funcional, organização e limpeza.

- [ ] **Step 1: Revisar limites e dependências**

Run:

```powershell
rg -n "AppContext\.jsx|react-refresh/only-export-components" front/src
rg -n "from ['\"].*context/AppContext" front/src
```

Expected: primeira busca sem ocorrências; segunda busca contendo apenas consumidores de `useApp` via `AppContext.js`.

- [ ] **Step 2: Confirmar que o backend não foi alterado pela reorganização**

Run: `cd C:\TCC\tcc; git diff --name-only 3ad40983..HEAD -- backend`

Expected: nenhuma ocorrência. As alterações não commitadas que já existiam no backend permanecem preservadas e fora dos commits da reorganização.

- [ ] **Step 3: Executar a matriz final em sequência**

Run: `cd C:\TCC\tcc\front; npm test`

Expected: zero falhas.

Run: `cd C:\TCC\tcc\front; npm run lint`

Expected: zero erros e zero avisos.

Run: `cd C:\TCC\tcc\front; npm run build`

Expected: exit code 0.

- [ ] **Step 4: Confirmar limpeza estrutural e Git**

Run:

```powershell
cd C:\TCC\tcc
rg -n '^\s*//|^\s*/\*|\{\s*/\*|catch\s*\{\s*/\*' front/src front/vite.config.js --glob '*.{js,jsx,css}'
git diff --check
git status --short
git log --oneline -8
```

Expected: busca sem ocorrências; nenhum erro de whitespace; somente alterações preexistentes do backend fora do escopo; commits pequenos e coerentes para a reorganização.
