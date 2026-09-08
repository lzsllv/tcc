import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AppProvider, useApp } from './AppContext.jsx';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { useLayoutEffect } from 'react';

const auth = vi.hoisted(() => ({ session: null, callback: null, nextSession: null }));
vi.mock('../auth/supabaseClient.js', () => ({
  createBrowserSupabaseClient: () => ({ auth: {
    getSession: async () => {
      if (auth.nextSession) { const pending = auth.nextSession; auth.nextSession = null; return pending; }
      return { data: { session: auth.session }, error: null };
    },
    onAuthStateChange: (callback) => {
      auth.callback = callback;
      return { data: { subscription: { unsubscribe() {} } } };
    },
    signOut: async () => {
      auth.session = null;
      auth.callback('SIGNED_OUT', null);
      return { error: null };
    },
  } }),
}));

let current;
function Probe() {
  const value = useApp();
  useLayoutEffect(() => { current = value; }, [value]);
  return <output data-testid="state">{JSON.stringify({
    owner: value.workspace?.ownerId ?? null,
    name: value.configuracoes.nomeNegocio,
    logo: value.configuracoes.logoNegocio,
    status: value.workspaceStatus,
  })}</output>;
}
function session(owner) {
  return { user: { id: owner, email: `${owner}@example.test`, user_metadata: {} }, access_token: owner };
}
function record(owner, revision = 1) {
  const workspace = createEmptyWorkspace(owner, '2026-09-01T12:00:00.000Z');
  workspace.settings.businessName = `Negócio ${owner}`;
  return { workspace, revision };
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function state() { return JSON.parse(screen.getByTestId('state').textContent); }
async function switchTo(owner) {
  await act(async () => {
    auth.session = owner ? session(owner) : null;
    auth.callback(owner ? 'SIGNED_IN' : 'SIGNED_OUT', auth.session);
  });
}

beforeEach(() => { localStorage.clear(); auth.session = session('A'); auth.nextSession = null; });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test.each(['success', 'failure'])('ignora resposta %s da gravação de A depois de entrar como B', async (outcome) => {
  const pending = deferred();
  const sent = deferred();
  vi.stubGlobal('fetch', async (_url, init) => {
    if (init.method === 'PUT') { sent.resolve(); return pending.promise; }
    const owner = init.headers.Authorization.replace('Bearer ', '');
    return Response.json(record(owner));
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  let saving;
  await act(async () => {
    saving = current.atualizarWorkspace(w => w).catch(error => error);
    await sent.promise;
  });
  await switchTo('B');
  await waitFor(() => expect(state().owner).toBe('B'));
  await act(async () => {
    if (outcome === 'success') pending.resolve(Response.json(record('A', 2)));
    else pending.reject(new Error('Erro antigo de A'));
    await saving;
  });
  expect(state()).toMatchObject({ owner: 'B', name: 'Negócio B', status: 'ready' });
});

test('logout durante gravação não restaura dados depois que a resposta chega', async () => {
  const pending = deferred();
  const sent = deferred();
  vi.stubGlobal('fetch', async (_url, init) => {
    if (init.method === 'PUT') { sent.resolve(); return pending.promise; }
    return Response.json(record('A'));
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  let saving;
  await act(async () => { saving = current.atualizarWorkspace(w => w).catch(e => e); await sent.promise; });
  await act(async () => { await current.logout(); });
  await act(async () => { pending.resolve(Response.json(record('A', 2))); await saving; });
  expect(state()).toMatchObject({ owner: null, name: '', status: 'idle' });
});

test('logout e novo login na mesma conta também invalidam a resposta anterior', async () => {
  const pending = deferred();
  const sent = deferred();
  vi.stubGlobal('fetch', async (_url, init) => {
    if (init.method === 'PUT') { sent.resolve(); return pending.promise; }
    return Response.json(record('A'));
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  let saving;
  await act(async () => { saving = current.atualizarWorkspace(w => w).catch(e => e); await sent.promise; });
  await switchTo(null);
  await switchTo('A');
  await waitFor(() => expect(state().owner).toBe('A'));
  const old = record('A', 2);
  old.workspace.settings.businessName = 'Resposta da sessão encerrada';
  await act(async () => { pending.resolve(Response.json(old)); await saving; });
  expect(state()).toMatchObject({ owner: 'A', name: 'Negócio A', status: 'ready' });
});

test('restauração inicial atrasada não substitui uma sessão mais recente', async () => {
  const restored = deferred();
  auth.nextSession = restored.promise;
  vi.stubGlobal('fetch', async (_url, init) => Response.json(record(init.headers.Authorization.replace('Bearer ', ''))));
  render(<AppProvider><Probe /></AppProvider>);
  await switchTo('B');
  await waitFor(() => expect(state().owner).toBe('B'));
  await act(async () => { restored.resolve({ data: { session: session('A') }, error: null }); });
  expect(state()).toMatchObject({ owner: 'B', name: 'Negócio B', status: 'ready' });
});

test('novo login na mesma conta não reaproveita carregamento da sessão encerrada', async () => {
  const pending = deferred();
  let loads = 0;
  vi.stubGlobal('fetch', async () => {
    loads += 1;
    if (loads === 1) return pending.promise;
    return Response.json(record('A', 3));
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(loads).toBe(1));
  await switchTo(null);
  await switchTo('A');
  const old = record('A', 1);
  old.workspace.settings.businessName = 'Carregamento antigo';
  await act(async () => { pending.resolve(Response.json(old)); });
  await waitFor(() => expect(state().status).toBe('ready'));
  expect(state().name).toBe('Negócio A');
});

test('conversão de logo atrasada não envia upload após logout e novo login', async () => {
  const conversion = deferred();
  const converting = deferred();
  const uploads = [];
  vi.stubGlobal('fetch', async (url, init = {}) => {
    if (url.startsWith('data:')) { converting.resolve(); return conversion.promise; }
    if (url.endsWith('/logo')) uploads.push(init);
    return Response.json(record('A', init.method === 'PUT' ? 2 : 1));
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  await act(async () => current.setConfiguracoes(c => ({ ...c, logoNegocio: 'data:image/png;base64,cG5n' })));
  let saving;
  await act(async () => { saving = current.salvarConfiguracoes().catch(e => e); await converting.promise; });
  await switchTo(null);
  await switchTo('A');
  await waitFor(() => expect(state().owner).toBe('A'));
  await act(async () => { conversion.resolve(new Response(new Blob(['png'], { type: 'image/png' }))); await saving; });
  expect(uploads).toEqual([]);
});

test('refresh de token da mesma conta não apaga o rascunho', async () => {
  vi.stubGlobal('fetch', async () => Response.json(record('A')));
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  await act(async () => current.setConfiguracoes(c => ({ ...c, nomeNegocio: 'Rascunho' })));
  await act(async () => auth.callback('TOKEN_REFRESHED', session('A')));
  expect(state().name).toBe('Rascunho');
});

test('não envia uma gravação de A com token obtido após a troca para B', async () => {
  const token = deferred();
  const writes = [];
  vi.stubGlobal('fetch', async (_url, init) => {
    if (init.method === 'PUT') writes.push(init);
    return Response.json(record(init.headers.Authorization.replace('Bearer ', '')));
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  auth.nextSession = token.promise;
  let saving;
  await act(async () => { saving = current.atualizarWorkspace(w => w).catch(e => e); });
  await switchTo('B');
  await waitFor(() => expect(state().owner).toBe('B'));
  await act(async () => { token.resolve({ data: { session: session('B') }, error: null }); await saving; });
  expect(writes).toEqual([]);
  expect(state()).toMatchObject({ owner: 'B', name: 'Negócio B', status: 'ready' });
});

test.each(['upload', 'delete'])('ignora resposta de logo (%s) depois de trocar de conta', async (operation) => {
  const pending = deferred();
  const sent = deferred();
  vi.stubGlobal('fetch', async (url, init = {}) => {
    if (url.startsWith('data:')) return new Response(new Blob(['png'], { type: 'image/png' }));
    if (url.endsWith('/logo')) { sent.resolve(); return pending.promise; }
    const owner = init.headers.Authorization.replace('Bearer ', '');
    const data = record(owner, init.method === 'PUT' ? 2 : 1);
    if (operation === 'delete' && owner === 'A') data.workspace.settings.logo = 'https://example.test/old.png';
    return Response.json(data);
  });
  render(<AppProvider><Probe /></AppProvider>);
  await waitFor(() => expect(state().owner).toBe('A'));
  await act(async () => current.setConfiguracoes(c => ({
    ...c, logoNegocio: operation === 'upload' ? 'data:image/png;base64,cG5n' : '',
  })));
  let saving;
  await act(async () => { saving = current.salvarConfiguracoes().catch(e => e); await sent.promise; });
  await switchTo('B');
  await waitFor(() => expect(state().owner).toBe('B'));
  await act(async () => { pending.resolve(Response.json(record('A', 3))); await saving; });
  expect(state()).toMatchObject({ owner: 'B', name: 'Negócio B', logo: '', status: 'ready' });
});
