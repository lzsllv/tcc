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
    error: value.workspaceError,
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

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
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

test('ignora carregamento tardio da conta anterior depois de trocar de sessão', async () => {
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-a', 'Ana', 'ana@example.com'));
  seedAccount(store, account('user-b', 'Bia', 'bia@example.com'));
  store.setSessionAccountId('user-a');
  const authService = new LocalAuthService(store, {
    create: async () => ({}),
    verify: async () => true,
  });
  const loads = { 'user-a': deferred(), 'user-b': deferred() };
  const repository = {
    loadWorkspace: ownerId => loads[ownerId].promise,
    migrateWorkspace: vi.fn(),
    saveWorkspace: vi.fn(),
  };
  const workspaceA = createEmptyWorkspace('user-a');
  const workspaceB = createEmptyWorkspace('user-b');
  workspaceA.settings.businessName = 'Negócio A atrasado';
  workspaceB.settings.businessName = 'Negócio B atual';

  render(
    <AppProvider authServiceFactory={() => authService} workspaceRepositoryFactory={() => repository}>
      <Probe />
    </AppProvider>,
  );
  await waitFor(() => expect(state()).toMatchObject({ user: 'user-a', status: 'loading' }));

  await act(async () => current.login('bia@example.com', 'senha'));
  await act(async () => loads['user-b'].resolve(workspaceB));
  await waitFor(() => expect(state()).toMatchObject({ owner: 'user-b', name: 'Negócio B atual', status: 'ready' }));

  await act(async () => loads['user-a'].resolve(workspaceA));
  expect(state()).toMatchObject({ owner: 'user-b', name: 'Negócio B atual', user: 'user-b', status: 'ready' });
});

test('rejeita gravação tardia sem substituir o workspace da sessão atual', async () => {
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-a', 'Ana', 'ana@example.com'));
  seedAccount(store, account('user-b', 'Bia', 'bia@example.com'));
  store.setSessionAccountId('user-a');
  const authService = new LocalAuthService(store, {
    create: async () => ({}),
    verify: async () => true,
  });
  const workspaceA = createEmptyWorkspace('user-a');
  const workspaceB = createEmptyWorkspace('user-b');
  workspaceA.settings.businessName = 'Negócio A';
  workspaceB.settings.businessName = 'Negócio B';
  const pendingSave = deferred();
  const repository = {
    loadWorkspace: async ownerId => ownerId === 'user-a' ? workspaceA : workspaceB,
    migrateWorkspace: vi.fn(),
    saveWorkspace: () => pendingSave.promise,
  };

  render(
    <AppProvider authServiceFactory={() => authService} workspaceRepositoryFactory={() => repository}>
      <Probe />
    </AppProvider>,
  );
  await waitFor(() => expect(state()).toMatchObject({ owner: 'user-a', status: 'ready' }));

  let staleSave;
  act(() => {
    staleSave = current.atualizarWorkspace(workspace => ({
      ...workspace,
      settings: { ...workspace.settings, businessName: 'Não deve aparecer' },
    }));
  });
  const staleSaveResult = staleSave.catch(error => error);
  await waitFor(() => expect(state().status).toBe('saving'));
  await act(async () => current.login('bia@example.com', 'senha'));
  await waitFor(() => expect(state()).toMatchObject({ owner: 'user-b', name: 'Negócio B', status: 'ready' }));

  await act(async () => pendingSave.resolve({
    ...workspaceA,
    settings: { ...workspaceA.settings, businessName: 'Não deve aparecer' },
  }));
  await expect(staleSaveResult).resolves.toMatchObject({ code: 'SESSION_CHANGED' });
  expect(state()).toMatchObject({ owner: 'user-b', name: 'Negócio B', user: 'user-b', status: 'ready' });
});

test('mantém o último workspace válido e expõe erro quando a gravação falha', async () => {
  const store = new LocalAccountStore(localStorage);
  seedAccount(store, account('user-1', 'Ana', 'ana@example.com'));
  store.setSessionAccountId('user-1');
  const workspace = createEmptyWorkspace('user-1');
  workspace.settings.businessName = 'Ateliê preservado';
  const repository = {
    loadWorkspace: async () => workspace,
    migrateWorkspace: vi.fn(),
    saveWorkspace: async () => { throw new Error('falha controlada de gravação'); },
  };

  render(<AppProvider workspaceRepositoryFactory={() => repository}><Probe /></AppProvider>);
  await waitFor(() => expect(state()).toMatchObject({ name: 'Ateliê preservado', status: 'ready' }));

  let saveError;
  await act(async () => {
    try {
      await current.atualizarWorkspace(currentWorkspace => ({
        ...currentWorkspace,
        settings: { ...currentWorkspace.settings, businessName: 'Alteração recusada' },
      }));
    } catch (error) {
      saveError = error;
    }
  });

  expect(saveError).toMatchObject({ message: 'falha controlada de gravação' });
  await waitFor(() => expect(state()).toMatchObject({
      error: 'falha controlada de gravação',
      name: 'Ateliê preservado',
      owner: 'user-1',
      status: 'error',
    }));
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
