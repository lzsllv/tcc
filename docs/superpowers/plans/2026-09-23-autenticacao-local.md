# Autenticação Local do Precifique — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o frontend do Precifique um SaaS local completo, com cadastro, login, sessão e workspaces isolados no navegador, sem Supabase, backend ou banco remoto.

**Architecture:** O frontend usará três unidades focadas: `password.js` para PBKDF2, `localAccountStore.js` para contas e sessão, e `LocalAuthService.js` para orquestrar autenticação. O `AppContext` conectará a sessão ao `LocalWorkspaceRepository`, que persistirá workspace e logo por usuário; a interface manterá as rotas atuais e informará claramente que os dados ficam no navegador.

**Tech Stack:** React 19, JavaScript ESM, Web Crypto, localStorage, Node Test Runner, Vitest, Testing Library, Vite 8.

**Spec:** `docs/superpowers/specs/2026-09-23-autenticacao-local-design.md`

## Global Constraints

- Node.js `^22.13.0 || >=24.0.0`.
- Nenhuma chamada a Supabase ou ao backend no fluxo do frontend.
- Nenhuma senha em texto puro no armazenamento persistente.
- Contas e workspaces separados por UUID de usuário.
- Nenhum comentário instrucional, marcador de implementação ou texto de processo no código.
- Módulos pequenos, com uma responsabilidade e nomes compatíveis com as convenções atuais.
- Não introduzir dependências de produção para autenticação ou criptografia.

## Review Focus

- E-mail com espaços ou letras maiúsculas deve identificar a mesma conta; coberto na Task 3.
- JSON local corrompido deve falhar sem sobrescrever contas ou sessão; coberto na Task 2.
- Sessão apontando para conta removida deve ser descartada; coberto na Task 3.
- Falha de quota do `localStorage` não deve informar cadastro ou salvamento bem-sucedido; coberto nas Tasks 2 e 4.
- Duas contas no mesmo navegador não podem compartilhar workspace ou logo; coberto nas Tasks 4 e 5.

---

## Estrutura de arquivos

- Criar `front/src/auth/password.js`: codificação binária, geração de salt, PBKDF2 e comparação.
- Criar `front/src/auth/password.test.js`: comportamento criptográfico público.
- Criar `front/src/auth/localAccountStore.js`: persistência versionada de contas e sessão ativa.
- Criar `front/src/auth/localAccountStore.test.js`: isolamento, corrupção e falhas de armazenamento.
- Criar `front/src/auth/LocalAuthService.js`: cadastro, login, restauração, logout e notificações.
- Criar `front/src/auth/LocalAuthService.test.js`: contrato completo de autenticação local.
- Modificar `front/src/auth/session.js`: mapear a sessão local para o usuário da aplicação.
- Modificar `front/src/auth/session.test.js`: fixar o novo formato local.
- Modificar `front/src/persistence/LocalWorkspaceRepository.js`: persistir e remover logo local.
- Modificar `front/src/persistence/LocalWorkspaceRepository.test.js`: cobrir logo e contas separadas.
- Criar `front/src/context/workspaceView.js`: conversões entre workspace e estado de apresentação.
- Criar `front/src/context/workspaceView.test.js`: preservar os mapeamentos extraídos.
- Modificar `front/src/context/AppContext.jsx`: usar autenticação e repositório locais.
- Substituir `front/src/context/AppContext.test.jsx`: testar integração local sem mocks de Supabase ou `fetch`.
- Modificar `front/src/pages/Cadastro.jsx`, `front/src/pages/Login.jsx`, `front/src/pages/LandingPage.jsx` e `front/src/components/Navbar.jsx`: ajustar fluxo e textos locais.
- Excluir `front/src/auth/SupabaseAuthService.js`, `front/src/auth/SupabaseAuthService.test.js`, `front/src/auth/supabaseClient.js` e `front/src/persistence/RemoteWorkspaceRepository.js`, `front/src/persistence/RemoteWorkspaceRepository.test.js`.
- Modificar `front/package.json` e `front/package-lock.json`: remover `@supabase/supabase-js`.
- Excluir `front/.env.example`: o frontend local não exige configuração.
- Modificar `README.md`: execução somente do frontend e limitações locais.

### Task 1: Derivação e verificação de senha

**Files:**
- Create: `front/src/auth/password.js`
- Test: `front/src/auth/password.test.js`

**Interfaces:**
- Consumes: `globalThis.crypto.getRandomValues`, `globalThis.crypto.subtle`.
- Produces: `createPasswordRecord(password)` e `verifyPassword(password, record)`; `record` possui `salt`, `passwordHash`, `iterations` e `algorithm`.

- [ ] **Step 1: Escrever o teste que falha para hash, salt e verificação**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createPasswordRecord, verifyPassword } from './password.js';

test('deriva credencial sem persistir a senha e usa salt exclusivo', async () => {
  const first = await createPasswordRecord('segredo-local');
  const second = await createPasswordRecord('segredo-local');
  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.passwordHash, 'segredo-local');
  assert.equal(await verifyPassword('segredo-local', first), true);
  assert.equal(await verifyPassword('senha-errada', first), false);
});

test('recusa senha vazia e ambiente sem Web Crypto', async () => {
  await assert.rejects(() => createPasswordRecord(''), /senha/i);
  await assert.rejects(
    () => createPasswordRecord('segredo-local', {}),
    /Web Crypto/i,
  );
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `cd C:\TCC\tcc\front; node --test src/auth/password.test.js`

Expected: FAIL com `ERR_MODULE_NOT_FOUND` para `password.js`.

- [ ] **Step 3: Implementar PBKDF2 mínimo**

```js
const ITERATIONS = 210_000;
const ALGORITHM = 'PBKDF2-SHA-256';
const encoder = new TextEncoder();

function cryptoApi(candidate) {
  if (!candidate?.getRandomValues || !candidate?.subtle) {
    throw new Error('Este navegador não oferece Web Crypto para proteger a senha.');
  }
  return candidate;
}

function encode(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

function decode(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function derive(password, salt, iterations, cryptoImpl) {
  const key = await cryptoImpl.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await cryptoImpl.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

export async function createPasswordRecord(password, candidate = globalThis.crypto) {
  if (typeof password !== 'string' || !password) throw new TypeError('Senha deve ser informada.');
  const cryptoImpl = cryptoApi(candidate);
  const salt = cryptoImpl.getRandomValues(new Uint8Array(16));
  const passwordHash = await derive(password, salt, ITERATIONS, cryptoImpl);
  return { algorithm: ALGORITHM, iterations: ITERATIONS, salt: encode(salt), passwordHash: encode(passwordHash) };
}

export async function verifyPassword(password, record, candidate = globalThis.crypto) {
  const cryptoImpl = cryptoApi(candidate);
  const actual = await derive(password, decode(record.salt), record.iterations, cryptoImpl);
  const expected = decode(record.passwordHash);
  return actual.length === expected.length && actual.every((byte, index) => byte === expected[index]);
}
```

- [ ] **Step 4: Executar o teste e confirmar aprovação**

Run: `cd C:\TCC\tcc\front; node --test src/auth/password.test.js`

Expected: PASS, 2 testes.

- [ ] **Step 5: Commitar a unidade criptográfica**

```powershell
git add front/src/auth/password.js front/src/auth/password.test.js
git commit -m "feat: add local password derivation"
```

### Task 2: Armazenamento versionado de contas e sessão

**Files:**
- Create: `front/src/auth/localAccountStore.js`
- Test: `front/src/auth/localAccountStore.test.js`

**Interfaces:**
- Consumes: objeto compatível com `Storage`.
- Produces: classe `LocalAccountStore` com `listAccounts()`, `findByEmail(email)`, `findById(id)`, `addAccount(account)`, `getSessionAccountId()`, `setSessionAccountId(id)` e `clearSession()`.

- [ ] **Step 1: Escrever testes de persistência, duplicidade, corrupção e quota**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalAccountStore } from './localAccountStore.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

const account = { id: 'user-1', name: 'Ana', email: 'ana@example.com', salt: 'salt', passwordHash: 'hash', iterations: 1, algorithm: 'PBKDF2-SHA-256' };

test('persiste contas e sessão ativa', () => {
  const store = new LocalAccountStore(new MemoryStorage());
  store.addAccount(account);
  store.setSessionAccountId(account.id);
  assert.deepEqual(store.findByEmail('ana@example.com'), account);
  assert.equal(store.getSessionAccountId(), 'user-1');
  store.clearSession();
  assert.equal(store.getSessionAccountId(), null);
});

test('não sobrescreve conta duplicada', () => {
  const store = new LocalAccountStore(new MemoryStorage());
  store.addAccount(account);
  assert.throws(() => store.addAccount({ ...account, id: 'user-2' }), /e-mail/i);
});

test('propaga armazenamento corrompido e falha de quota', () => {
  const storage = new MemoryStorage();
  storage.setItem('precifique:accounts:v1', '{');
  const store = new LocalAccountStore(storage);
  assert.throws(() => store.listAccounts(), /dados locais/i);
  storage.setItem('precifique:accounts:v1', '[]');
  storage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => store.addAccount(account), /quota/);
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `cd C:\TCC\tcc\front; node --test src/auth/localAccountStore.test.js`

Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implementar armazenamento sem mutações externas**

```js
const ACCOUNTS_KEY = 'precifique:accounts:v1';
const SESSION_KEY = 'precifique:session:v1';

function clone(value) { return structuredClone(value); }

export class LocalAccountStore {
  constructor(storage = globalThis.localStorage) {
    if (!storage?.getItem || !storage?.setItem || !storage?.removeItem) throw new TypeError('Armazenamento local compatível deve ser informado.');
    this.storage = storage;
  }

  listAccounts() {
    const serialized = this.storage.getItem(ACCOUNTS_KEY);
    if (serialized === null) return [];
    try {
      const accounts = JSON.parse(serialized);
      if (!Array.isArray(accounts)) throw new Error();
      return clone(accounts);
    } catch {
      throw new Error('Os dados locais das contas estão corrompidos.');
    }
  }

  findByEmail(email) { return this.listAccounts().find(account => account.email === email) ?? null; }
  findById(id) { return this.listAccounts().find(account => account.id === id) ?? null; }

  addAccount(account) {
    const accounts = this.listAccounts();
    if (accounts.some(current => current.email === account.email)) throw new Error('Já existe uma conta com este e-mail.');
    this.storage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, clone(account)]));
    return clone(account);
  }

  getSessionAccountId() { return this.storage.getItem(SESSION_KEY); }
  setSessionAccountId(id) { this.storage.setItem(SESSION_KEY, id); }
  clearSession() { this.storage.removeItem(SESSION_KEY); }
}
```

- [ ] **Step 4: Executar teste e lint focado**

Run: `cd C:\TCC\tcc\front; node --test src/auth/localAccountStore.test.js; npm run lint`

Expected: PASS, 3 testes; lint sem erros.

- [ ] **Step 5: Commitar armazenamento**

```powershell
git add front/src/auth/localAccountStore.js front/src/auth/localAccountStore.test.js
git commit -m "feat: store local accounts and sessions"
```

### Task 3: Serviço de autenticação local

**Files:**
- Create: `front/src/auth/LocalAuthService.js`
- Test: `front/src/auth/LocalAuthService.test.js`
- Modify: `front/src/auth/session.js`
- Modify: `front/src/auth/session.test.js`
- Delete: `front/src/auth/SupabaseAuthService.js`
- Delete: `front/src/auth/SupabaseAuthService.test.js`
- Delete: `front/src/auth/supabaseClient.js`

**Interfaces:**
- Consumes: `LocalAccountStore`, `createPasswordRecord`, `verifyPassword`, gerador de UUID e relógio.
- Produces: `LocalAuthService.getSession()`, `subscribe(callback)`, `signUp(name,email,password)`, `signIn(email,password)` e `signOut()`.

- [ ] **Step 1: Escrever testes do contrato local**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalAccountStore } from './localAccountStore.js';
import { LocalAuthService } from './LocalAuthService.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

const passwordPort = {
  create: async password => ({ salt: 'test-salt', passwordHash: Array.from(password, char => char.charCodeAt(0)).join('-'), iterations: 1, algorithm: 'test' }),
  verify: async (password, account) => account.passwordHash === Array.from(password, char => char.charCodeAt(0)).join('-'),
};

test('cadastra, normaliza e restaura uma sessão local', async () => {
  const store = new LocalAccountStore(new MemoryStorage());
  const service = new LocalAuthService(store, passwordPort, () => 'user-1', () => '2026-09-23T12:00:00.000Z');
  const result = await service.signUp(' Ana ', ' ANA@EXAMPLE.COM ', 'segredo');
  assert.equal(result.requiresEmailConfirmation, false);
  assert.deepEqual((await service.getSession()).user, { id: 'user-1', name: 'Ana', email: 'ana@example.com' });
  assert.equal(JSON.stringify(store.listAccounts()).includes('segredo'), false);
});

test('recusa e-mail duplicado e usa mensagem única para credencial inválida', async () => {
  const service = new LocalAuthService(new LocalAccountStore(new MemoryStorage()), passwordPort, () => 'user-1');
  await service.signUp('Ana', 'ana@example.com', 'segredo');
  await assert.rejects(() => service.signUp('Outra', ' ANA@example.com ', 'nova'), /Já existe/);
  await assert.rejects(() => service.signIn('ausente@example.com', 'x'), /E-mail ou senha inválidos/);
  await assert.rejects(() => service.signIn('ana@example.com', 'errada'), /E-mail ou senha inválidos/);
});

test('notifica login e logout, preservando a conta', async () => {
  const store = new LocalAccountStore(new MemoryStorage());
  const service = new LocalAuthService(store, passwordPort, () => 'user-1');
  const sessions = [];
  service.subscribe(session => sessions.push(session));
  await service.signUp('Ana', 'ana@example.com', 'segredo');
  await service.signOut();
  await service.signIn('ANA@example.com', 'segredo');
  assert.deepEqual(sessions.map(session => session?.user.id ?? null), ['user-1', null, 'user-1']);
  assert.equal(store.listAccounts().length, 1);
});

test('descarta sessão que aponta para conta ausente', async () => {
  const storage = new MemoryStorage();
  const store = new LocalAccountStore(storage);
  store.setSessionAccountId('missing');
  const service = new LocalAuthService(store, passwordPort);
  assert.equal(await service.getSession(), null);
  assert.equal(store.getSessionAccountId(), null);
});
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `cd C:\TCC\tcc\front; node --test src/auth/LocalAuthService.test.js src/auth/session.test.js`

Expected: FAIL porque `LocalAuthService.js` não existe e `session.js` ainda espera metadados Supabase.

- [ ] **Step 3: Implementar serviço e formato de sessão local**

```js
import { createPasswordRecord, verifyPassword } from './password.js';

const defaultPasswordPort = { create: createPasswordRecord, verify: verifyPassword };

function normalizeEmail(email) { return String(email ?? '').trim().toLowerCase(); }
function session(account) { return { user: { id: account.id, name: account.name, email: account.email } }; }

export class LocalAuthService {
  constructor(store, passwordPort = defaultPasswordPort, createId = () => crypto.randomUUID(), now = () => new Date().toISOString()) {
    this.store = store;
    this.passwordPort = passwordPort;
    this.createId = createId;
    this.now = now;
    this.listeners = new Set();
  }

  async getSession() {
    const id = this.store.getSessionAccountId();
    if (!id) return null;
    const account = this.store.findById(id);
    if (!account) { this.store.clearSession(); return null; }
    return session(account);
  }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }
  emit(value) { for (const listener of this.listeners) listener(value); }

  async signUp(name, email, password) {
    const normalizedName = String(name ?? '').trim();
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedName || !normalizedEmail || !password) throw new Error('Preencha todos os campos.');
    if (this.store.findByEmail(normalizedEmail)) throw new Error('Já existe uma conta com este e-mail.');
    const credential = await this.passwordPort.create(password);
    const account = this.store.addAccount({ id: this.createId(), name: normalizedName, email: normalizedEmail, ...credential, createdAt: this.now() });
    this.store.setSessionAccountId(account.id);
    const current = session(account);
    this.emit(current);
    return { user: current.user, session: current, requiresEmailConfirmation: false };
  }

  async signIn(email, password) {
    const account = this.store.findByEmail(normalizeEmail(email));
    if (!account || !await this.passwordPort.verify(password, account)) throw new Error('E-mail ou senha inválidos.');
    this.store.setSessionAccountId(account.id);
    const current = session(account);
    this.emit(current);
    return { user: current.user, session: current };
  }

  async signOut() { this.store.clearSession(); this.emit(null); }
}
```

Atualizar `session.js` para retornar `{ id, email, nome: user.name || emailPrefix || 'Usuário' }` e adaptar seu teste para o formato `{ user: { id, name, email } }`.

- [ ] **Step 4: Executar testes de autenticação e sessão**

Run: `cd C:\TCC\tcc\front; node --test src/auth/LocalAuthService.test.js src/auth/session.test.js`

Expected: PASS em todos os casos.

- [ ] **Step 5: Remover arquivos Supabase e commit**

```powershell
git rm front/src/auth/SupabaseAuthService.js front/src/auth/SupabaseAuthService.test.js front/src/auth/supabaseClient.js
git add front/src/auth/LocalAuthService.js front/src/auth/LocalAuthService.test.js front/src/auth/session.js front/src/auth/session.test.js
git commit -m "feat: replace Supabase auth with local accounts"
```

### Task 4: Workspace e logo locais

**Files:**
- Modify: `front/src/persistence/LocalWorkspaceRepository.js`
- Modify: `front/src/persistence/LocalWorkspaceRepository.test.js`
- Delete: `front/src/persistence/RemoteWorkspaceRepository.js`
- Delete: `front/src/persistence/RemoteWorkspaceRepository.test.js`

**Interfaces:**
- Consumes: workspace v2 existente.
- Produces: `saveLogo(ownerId, dataUrl)` e `deleteLogo(ownerId)` compatíveis com `WorkspaceService`.

- [ ] **Step 1: Escrever testes de logo e isolamento**

Adicionar a `LocalWorkspaceRepository.test.js`:

```js
test('salva e remove o logo somente no workspace solicitado', async () => {
  const repository = new LocalWorkspaceRepository(new MemoryStorage());
  await repository.saveWorkspace('user-1', createEmptyWorkspace('user-1'));
  await repository.saveWorkspace('user-2', createEmptyWorkspace('user-2'));
  await repository.saveLogo('user-1', 'data:image/png;base64,cG5n');
  assert.equal((await repository.loadWorkspace('user-1')).settings.logo, 'data:image/png;base64,cG5n');
  assert.equal((await repository.loadWorkspace('user-2')).settings.logo, '');
  await repository.deleteLogo('user-1');
  assert.equal((await repository.loadWorkspace('user-1')).settings.logo, '');
});

test('recusa alterar logo quando o workspace não existe', async () => {
  const repository = new LocalWorkspaceRepository(new MemoryStorage());
  await assert.rejects(() => repository.saveLogo('missing', 'data:image/png;base64,cG5n'), /não encontrado/i);
});
```

- [ ] **Step 2: Executar teste e confirmar a falha**

Run: `cd C:\TCC\tcc\front; node --test src/persistence/LocalWorkspaceRepository.test.js`

Expected: FAIL com `repository.saveLogo is not a function`.

- [ ] **Step 3: Implementar logo via workspace existente**

```js
  async updateLogo(ownerId, logo) {
    const workspace = await this.loadWorkspace(ownerId);
    if (!workspace) throw new ReferenceError('Workspace não encontrado para atualização do logo.');
    return this.saveWorkspace(ownerId, { ...workspace, settings: { ...workspace.settings, logo } });
  }

  async saveLogo(ownerId, dataUrl) {
    if (!/^data:image\/(?:png|jpeg|webp);/i.test(dataUrl)) throw new TypeError('Formato de logo inválido.');
    return this.updateLogo(ownerId, dataUrl);
  }

  async deleteLogo(ownerId) {
    return this.updateLogo(ownerId, '');
  }
```

- [ ] **Step 4: Executar testes completos de persistência**

Run: `cd C:\TCC\tcc\front; node --test src/persistence/*.test.js`

Expected: PASS em todos os arquivos.

- [ ] **Step 5: Remover repositório remoto e commit**

```powershell
git rm front/src/persistence/RemoteWorkspaceRepository.js front/src/persistence/RemoteWorkspaceRepository.test.js
git add front/src/persistence/LocalWorkspaceRepository.js front/src/persistence/LocalWorkspaceRepository.test.js
git commit -m "feat: persist workspaces and logos locally"
```

### Task 5: Separar apresentação do workspace e integrar o contexto

**Files:**
- Create: `front/src/context/workspaceView.js`
- Test: `front/src/context/workspaceView.test.js`
- Modify: `front/src/context/AppContext.jsx`
- Replace: `front/src/context/AppContext.test.jsx`

**Interfaces:**
- Consumes: `LocalAuthService`, `LocalAccountStore`, `LocalWorkspaceRepository`, `WorkspaceService`.
- Produces: o mesmo valor público de `AppContext`, com sessão e workspace locais.

- [ ] **Step 1: Escrever testes das conversões extraídas**

Criar `workspaceView.test.js` com workspace literal e verificar:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { fixedCostsFromView, workspaceToView } from './workspaceView.js';

test('converte workspace em estado monetário de apresentação', () => {
  const workspace = createEmptyWorkspace('user-1');
  workspace.fixedCosts.aluguel = 125_50;
  workspace.settings.businessName = 'Ateliê';
  const view = workspaceToView(workspace);
  assert.equal(view.custosFixos.aluguel, 125.5);
  assert.equal(view.configuracoes.nomeNegocio, 'Ateliê');
});

test('converte custos visuais para centavos sem manter extras vazios', () => {
  assert.deepEqual(fixedCostsFromView({ aluguel: 10.5, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [
    { id: 'empty', descricao: ' ', valor: 0 },
    { id: 'valid', descricao: 'Gás', valor: 20 },
  ] }).extras, [{ id: 'valid', name: 'Gás', valueCents: 2000 }]);
});
```

- [ ] **Step 2: Executar e confirmar falha do módulo ausente**

Run: `cd C:\TCC\tcc\front; node --test src/context/workspaceView.test.js`

Expected: FAIL com `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Extrair funções puras e trocar dependências do contexto**

Criar `workspaceView.js`:

```js
import { calculateOfferVariableCost } from '../domain/pricing/offers.js';

export function fixedCostsFromView(fixedCosts) {
  const cents = value => Math.round(Number(value || 0) * 100);
  return {
    ...Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros'].map(key => [key, cents(fixedCosts[key])])),
    extras: (fixedCosts.extras ?? [])
      .filter(extra => extra.descricao.trim() || Number(extra.valor || 0) > 0)
      .map(extra => ({ id: String(extra.id), name: extra.descricao.trim(), valueCents: cents(extra.valor) })),
  };
}

export function workspaceToView(workspace) {
  const ingredientsById = Object.fromEntries(workspace.ingredients.map(item => [item.id, item]));
  const produtos = workspace.offers.filter(offer => offer.active).map(offer => {
    let unitCostCents = 0;
    try { unitCostCents = calculateOfferVariableCost(offer, ingredientsById, 0).unitCostCents; } catch { unitCostCents = 0; }
    return {
      id: offer.id,
      nome: offer.name,
      categoria: offer.category,
      custo: unitCostCents / 100,
      tempoProducao: offer.batchTimeMinutes / offer.batchYield / 60,
      quantidadeMes: offer.expectedMonthlySales,
    };
  });
  return {
    produtos,
    custosFixos: {
      ...Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros'].map(key => [key, (workspace.fixedCosts?.[key] ?? 0) / 100])),
      extras: (workspace.fixedCosts?.extras ?? []).map(extra => ({ id: extra.id, descricao: extra.name, valor: extra.valueCents / 100 })),
    },
    configuracoes: {
      margemLucro: workspace.settings.defaultMarginBps / 100,
      custoHora: workspace.settings.laborHourCents / 100,
      regiaoAtuacao: workspace.settings.region,
      nomeNegocio: workspace.settings.businessName,
      logoNegocio: workspace.settings.logo,
    },
  };
}
```

Em `AppContext.jsx`:

```js
import { LocalAuthService } from '../auth/LocalAuthService.js';
import { LocalAccountStore } from '../auth/localAccountStore.js';
import { LocalWorkspaceRepository } from '../persistence/LocalWorkspaceRepository.js';
import { fixedCostsFromView, workspaceToView } from './workspaceView.js';

const [authService] = useState(() => new LocalAuthService(new LocalAccountStore(localStorage)));
```

No `acceptSession`, substituir `RemoteWorkspaceRepository` por:

```js
setWorkspaceService(ownerId
  ? new WorkspaceService(new LocalWorkspaceRepository(localStorage), localStorage)
  : null);
```

Substituir todas as aplicações separadas de produtos, custos e configurações por uma função local `applyWorkspaceView(workspace)` que usa `workspaceToView`. Manter `sessionScope` e as verificações de escopo para impedir que efeitos antigos restaurem uma conta encerrada.

- [ ] **Step 4: Escrever integração do contexto antes de remover os mocks antigos**

Substituir `AppContext.test.jsx` por testes reais que criam conta com `LocalAuthService`, renderizam o provider e verificam:

```jsx
test('restaura conta local e persiste atualização sem fetch', async () => {
  const requests = vi.fn(() => { throw new Error('fetch não deve ser chamado'); });
  vi.stubGlobal('fetch', requests);
  const store = new LocalAccountStore(localStorage);
  store.addAccount({ id: 'user-1', name: 'Ana', email: 'ana@example.com', salt: 'salt', passwordHash: 'hash', iterations: 1, algorithm: 'test' });
  store.setSessionAccountId('user-1');
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('user-1'));
  await act(async () => current.atualizarWorkspace(workspace => ({ ...workspace, settings: { ...workspace.settings, businessName: 'Ateliê' } })));
  expect(JSON.parse(localStorage.getItem('precifique:workspace:v2:user-1')).settings.businessName).toBe('Ateliê');
  expect(requests).not.toHaveBeenCalled();
});
```

Para permitir esse teste sem mock de módulo, `AppProvider` aceitará opcionalmente `authServiceFactory` e `workspaceRepositoryFactory`, com padrões locais de produção. Adicionar também casos para logout limpar a visão e duas contas restaurarem workspaces diferentes.

- [ ] **Step 5: Executar testes de contexto e frontend completo**

Run: `cd C:\TCC\tcc\front; npm test`

Expected: todos os testes unitários e de UI aprovados, sem chamadas remotas.

- [ ] **Step 6: Commitar integração React**

```powershell
git add front/src/context/AppContext.jsx front/src/context/AppContext.test.jsx front/src/context/workspaceView.js front/src/context/workspaceView.test.js
git commit -m "feat: connect local accounts to local workspaces"
```

### Task 6: Fluxo de interface, dependências e documentação

**Files:**
- Modify: `front/src/pages/Cadastro.jsx`
- Modify: `front/src/pages/Login.jsx`
- Modify: `front/src/pages/LandingPage.jsx`
- Modify: `front/src/components/Navbar.jsx`
- Create: `front/src/App.local.test.jsx`
- Modify: `front/package.json`
- Modify: `front/package-lock.json`
- Delete: `front/.env.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: contrato público inalterado do `AppContext`.
- Produces: fluxo visível totalmente local, instalação sem Supabase e documentação coerente.

- [ ] **Step 1: Escrever teste de fluxo de cadastro e login local**

Criar `front/src/App.local.test.jsx`:

```jsx
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/cadastro');
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('cadastra, restaura e autentica uma conta sem rede remota', async () => {
  const requests = vi.fn(() => { throw new Error('fetch não deve ser chamado'); });
  vi.stubGlobal('fetch', requests);
  render(<App />);

  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Ana Local' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ANA@EXAMPLE.COM' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'segredo-local' } });
  fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'segredo-local' } });
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Criar conta' })));

  expect(await screen.findByRole('heading', { name: 'Olá, Ana' })).toBeTruthy();
  await act(async () => fireEvent.click(screen.getByRole('button', { name: /Sair/ })));
  expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeTruthy();

  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: ' ana@example.com ' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'segredo-local' } });
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Entrar' })));

  expect(await screen.findByRole('heading', { name: 'Olá, Ana' })).toBeTruthy();
  expect(requests).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha de texto/fluxo remoto**

Run: `cd C:\TCC\tcc\front; npm run test:ui`

Expected: FAIL enquanto cadastro ainda trata confirmação por e-mail ou a aplicação importa Supabase.

- [ ] **Step 3: Ajustar interface para armazenamento local**

Em `Cadastro.jsx`, remover `sucesso` e o ramo `requiresEmailConfirmation`; após `cadastrar`, sempre navegar a `/dashboard`. Alterar textos de segurança para “Seus dados ficam salvos somente neste navegador.”

Em `Login.jsx`, manter validação e navegação, substituindo promessas de conta remota por “Acesse seus dados salvos neste navegador.”

Em `LandingPage.jsx`, trocar “Crie sua conta gratuita” por “Crie sua conta local”, manter a FAQ que informa persistência no navegador e acrescentar que os dados não sincronizam entre dispositivos.

Em `Navbar.jsx`, manter logout e redirecionamento, sem excluir dados.

- [ ] **Step 4: Remover dependência e configuração Supabase**

Run: `cd C:\TCC\tcc\front; npm uninstall @supabase/supabase-js`

Excluir `front/.env.example`. Confirmar com `rg -n "supabase|VITE_API_URL|VITE_SUPABASE" front/src front/package.json front/.env.example` que não restam referências executáveis.

- [ ] **Step 5: Atualizar README sem passos de banco**

Documentar somente:

```powershell
Set-Location C:\TCC\tcc\front
npm install
npm run dev
```

Informar que contas e dados ficam no navegador atual, que limpar os dados do site os remove e que a exportação serve como backup. Manter a pasta backend descrita como legado fora do fluxo atual, sem instruir sua execução.

- [ ] **Step 6: Executar verificação integral do frontend**

Run: `cd C:\TCC\tcc\front; npm test`

Expected: zero falhas.

Run: `cd C:\TCC\tcc\front; npm run lint`

Expected: zero erros e zero avisos.

Run: `cd C:\TCC\tcc\front; npm run build`

Expected: exit code 0.

- [ ] **Step 7: Smoke test do build de produção**

Run: `cd C:\TCC\tcc\front; npm run preview -- --host 127.0.0.1`

Verificar `http://127.0.0.1:4173`, cadastrar duas contas, criar dados diferentes, atualizar a página, alternar por logout/login e confirmar isolamento. Nas ferramentas de rede, confirmar ausência de requisições a `supabase.co` e `localhost:3333`.

- [ ] **Step 8: Commitar interface e limpeza final**

```powershell
git add README.md front/src front/package.json front/package-lock.json front/.env.example
git commit -m "feat: run Precifique as a local-first SaaS"
```

### Task 7: Revisão final contra a especificação

**Files:**
- Review: todos os arquivos alterados nas Tasks 1–6.

**Interfaces:**
- Consumes: implementação completa.
- Produces: evidência final de que o SaaS funciona sem serviços remotos.

- [ ] **Step 1: Confirmar ausência de segredos e integrações remotas no bundle**

Run: `cd C:\TCC\tcc; rg -n "SUPABASE_SECRET|VITE_SUPABASE|supabase\.co|localhost:3333" front/src front/dist`

Expected: nenhuma ocorrência.

- [ ] **Step 2: Rodar toda a matriz novamente em sequência**

Run: `cd C:\TCC\tcc\front; npm test; npm run lint; npm run build`

Expected: todos os comandos com exit code 0.

- [ ] **Step 3: Revisar estado do repositório**

Run: `cd C:\TCC\tcc; git diff --check; git status --short; git log --oneline -10`

Expected: sem erros de whitespace; apenas alterações intencionais previamente existentes fora do escopo podem permanecer não commitadas.

- [ ] **Step 4: Comparar requisitos da especificação**

Confirmar explicitamente: cadastro local, senha derivada, login, restauração, logout, persistência após refresh, duas contas isoladas, logo local, demonstração, exportação, zero rede remota, textos locais, testes, lint e build.
