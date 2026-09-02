import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from './workspace.js';
import { RemoteWorkspaceRepository } from './RemoteWorkspaceRepository.js';

test('carrega workspace autenticado e usa a revisão recebida ao salvar', async () => {
  const ownerId = '11111111-1111-4111-8111-111111111111';
  const workspace = createEmptyWorkspace(ownerId, '2026-09-01T12:00:00.000Z');
  const requests = [];
  const responses = [
    new Response(JSON.stringify({ workspace, revision: 3 }), { status: 200, headers: { 'content-type': 'application/json' } }),
    new Response(JSON.stringify({ workspace: { ...workspace, settings: { ...workspace.settings, businessName: 'Novo nome' } }, revision: 4 }), { status: 200, headers: { 'content-type': 'application/json' } }),
  ];
  const repository = new RemoteWorkspaceRepository({
    baseUrl: 'http://localhost:3333',
    getAccessToken: async () => 'access-token',
    fetchImpl: async (url, init) => { requests.push({ url, init }); return responses.shift(); },
    storage: { getItem() { return null; }, setItem() {} },
  });

  const loaded = await repository.loadWorkspace(ownerId);
  const saved = await repository.saveWorkspace(ownerId, {
    ...loaded,
    settings: { ...loaded.settings, businessName: 'Novo nome' },
  });

  assert.equal(saved.settings.businessName, 'Novo nome');
  assert.equal(requests[0].init.headers.Authorization, 'Bearer access-token');
  assert.deepEqual(JSON.parse(requests[1].init.body), {
    workspace: { ...workspace, settings: { ...workspace.settings, businessName: 'Novo nome' } },
    expectedRevision: 3,
  });
});

test('retorna null quando ainda não existe workspace remoto', async () => {
  const repository = new RemoteWorkspaceRepository({
    baseUrl: 'http://localhost:3333',
    getAccessToken: async () => 'access-token',
    fetchImpl: async () => new Response(JSON.stringify({ error: { code: 'WORKSPACE_NOT_FOUND' } }), { status: 404 }),
    storage: { getItem() { return null; }, setItem() {} },
  });

  assert.equal(await repository.loadWorkspace('owner-1'), null);
});

test('mantém um backup e limpa os dados legados somente após o bootstrap concluir', async () => {
  const ownerId = '11111111-1111-4111-8111-111111111111';
  const workspace = createEmptyWorkspace(ownerId, '2026-09-01T12:00:00.000Z');
  const data = new Map([
    ['produtos', JSON.stringify([])],
    ['custosFixos', JSON.stringify({ aluguel: 10 })],
    ['configuracoes', JSON.stringify({ nomeNegocio: 'Ateliê' })],
  ]);
  const storage = {
    getItem(key) { return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
  };
  const repository = new RemoteWorkspaceRepository({
    baseUrl: 'http://localhost:3333',
    getAccessToken: async () => 'access-token',
    fetchImpl: async () => new Response(JSON.stringify({ workspace, revision: 1 }), { status: 201, headers: { 'content-type': 'application/json' } }),
    storage,
    now: () => '2026-09-01T12:00:00.000Z',
  });

  await repository.migrateWorkspace(ownerId, { produtos: [], custosFixos: { aluguel: 10 }, configuracoes: { nomeNegocio: 'Ateliê' } });
  await repository.createBackup(ownerId, { produtos: [{ id: 'não sobrescrever' }] });

  assert.equal(data.has('produtos'), false);
  assert.equal(data.has('custosFixos'), false);
  assert.equal(data.has('configuracoes'), false);
  const backups = [...data.entries()].filter(([key]) => key.startsWith('precifique:backup:v1:'));
  assert.equal(backups.length, 1);
  assert.deepEqual(JSON.parse(backups[0][1]).produtos, []);
});
