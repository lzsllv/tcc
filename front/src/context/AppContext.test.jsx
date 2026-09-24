import { useLayoutEffect } from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { LocalAuthService } from '../auth/LocalAuthService.js';
import { LocalAccountStore } from '../auth/localAccountStore.js';
import { LocalWorkspaceRepository } from '../persistence/LocalWorkspaceRepository.js';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { useApp } from './AppContext.js';
import { AppProvider } from './AppProvider.jsx';

let current;

function Probe() {
  const value = useApp();
  useLayoutEffect(() => {
    current = value;
  }, [value]);
  return <output data-testid="state">{JSON.stringify({
    owner: value.workspace?.ownerId ?? null,
    name: value.configuracoes.nomeNegocio,
    status: value.workspaceStatus,
    user: value.usuarioLogado?.id ?? null,
  })}</output>;
}

function OutsideProviderProbe() {
  return <output data-testid="outside-context">{String(useApp())}</output>;
}

function ContractProbe() {
  return <output data-testid="contract">{JSON.stringify(Object.keys(useApp()).sort())}</output>;
}

function state() {
  return JSON.parse(screen.getByTestId('state').textContent);
}

function account(id, name, email) {
  return {
    id,
    name,
    email,
    salt: 'salt',
    passwordHash: 'hash',
    iterations: 1,
    algorithm: 'test',
  };
}

function seedAccount(store, data) {
  store.addAccount(data);
  return data;
}

beforeEach(() => {
  localStorage.clear();
  current = null;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('restaura conta local e persiste atualização sem acesso remoto', async () => {
  const requests = vi.fn(() => {
    throw new Error('fetch não deve ser chamado');
  });
  vi.stubGlobal('fetch', requests);
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-1', 'Ana', 'ana@example.com'));
  store.setSessionAccountId('user-1');

  render(<AppProvider><Probe /></AppProvider>);

  await waitFor(() => expect(state()).toMatchObject({ owner: 'user-1', user: 'user-1', status: 'ready' }));
  await act(async () => {
    await current.atualizarWorkspace(workspace => ({
      ...workspace,
      settings: { ...workspace.settings, businessName: 'Ateliê' },
    }));
  });

  const saved = JSON.parse(localStorage.getItem('precifique:workspace:v2:user-1'));
  expect(saved.settings.businessName).toBe('Ateliê');
  expect(state().name).toBe('Ateliê');
  expect(requests).not.toHaveBeenCalled();
});

test('preserva o valor ausente fora do provedor', () => {
  render(<OutsideProviderProbe />);

  expect(screen.getByTestId('outside-context').textContent).toBe('undefined');
});

test('expõe o contrato de contexto usado pelo frontend', () => {
  render(<AppProvider><ContractProbe /></AppProvider>);

  const keys = JSON.parse(screen.getByTestId('contract').textContent);
  expect(keys).toEqual([
    'atualizarWorkspace', 'authStatus', 'cadastrar',
    'calcularCustoTotal', 'calcularLucroMensal', 'calcularPrecoSugerido',
    'carregarDemo', 'configuracoes', 'custoFixoPorProduto',
    'custoFixoPorUnidade', 'custosFixos',
    'exportarWorkspace', 'login', 'logout',
    'podeCarregarDemo', 'produtos', 'salvarConfiguracoes',
    'salvarCustosFixos', 'setConfiguracoes', 'setCustosFixos',
    'totalCustosFixos', 'totalUnidadesMes', 'usuarioLogado', 'workspace',
    'workspaceError', 'workspaceStatus',
  ].sort());
});

test('logout remove sessão e limpa os dados visíveis', async () => {
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-1', 'Ana', 'ana@example.com'));
  store.setSessionAccountId('user-1');
  const repository = new LocalWorkspaceRepository(localStorage);
  const workspace = createEmptyWorkspace('user-1');
  workspace.settings.businessName = 'Ateliê';
  await repository.saveWorkspace('user-1', workspace);

  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().name).toBe('Ateliê'));

  await act(async () => current.logout());

  await waitFor(() => expect(state()).toMatchObject({ owner: null, name: '', status: 'idle', user: null }));
  expect(store.getSessionAccountId()).toBeNull();
});

test('cada conta restaura somente o próprio workspace', async () => {
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-a', 'Ana', 'ana@example.com'));
  seedAccount(store, account('user-b', 'Bia', 'bia@example.com'));
  store.setSessionAccountId('user-a');
  const repository = new LocalWorkspaceRepository(localStorage);
  const workspaceA = createEmptyWorkspace('user-a');
  const workspaceB = createEmptyWorkspace('user-b');
  workspaceA.settings.businessName = 'Negócio A';
  workspaceB.settings.businessName = 'Negócio B';
  await repository.saveWorkspace('user-a', workspaceA);
  await repository.saveWorkspace('user-b', workspaceB);
  const authService = new LocalAuthService(store, {
    create: async () => ({}),
    verify: async () => true,
  });

  render(
    <AppProvider authServiceFactory={() => authService}>
      <Probe />
    </AppProvider>,
  );
  await waitFor(() => expect(state()).toMatchObject({ owner: 'user-a', name: 'Negócio A' }));

  await act(async () => current.login('bia@example.com', 'senha'));

  await waitFor(() => expect(state()).toMatchObject({ owner: 'user-b', name: 'Negócio B', user: 'user-b' }));
  expect(JSON.parse(localStorage.getItem('precifique:workspace:v2:user-a')).settings.businessName).toBe('Negócio A');
});

test('ignora restauração tardia depois de receber um evento de autenticação', async () => {
  let resolveSession;
  let subscriber;
  const authService = {
    getSession: () => new Promise(resolve => { resolveSession = resolve; }),
    subscribe: callback => { subscriber = callback; return () => {}; },
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  };

  render(<AppProvider authServiceFactory={() => authService}><Probe /></AppProvider>);

  await act(async () => subscriber({ user: { id: 'user-new', name: 'Nova' } }));
  await act(async () => resolveSession({ user: { id: 'user-old', name: 'Antiga' } }));

  await waitFor(() => expect(state().user).toBe('user-new'));
});

test('salva configurações da demonstração sem regravar o logo interno', async () => {
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-1', 'Ana', 'ana@example.com'));
  store.setSessionAccountId('user-1');

  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().status).toBe('ready'));
  await act(async () => current.carregarDemo());

  await expect(current.salvarConfiguracoes()).resolves.toMatchObject({
    settings: { businessName: 'Doces da Maria — DEMO' },
  });
  expect(JSON.parse(localStorage.getItem('precifique:workspace:v2:user-1')).settings.logo)
    .toMatch(/^data:image\/svg\+xml,/);
});
