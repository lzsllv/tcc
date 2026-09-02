import test from 'node:test';
import assert from 'node:assert/strict';
import { WorkspaceService } from './WorkspaceService.js';
import { LocalWorkspaceRepository } from '../persistence/index.js';

class MemoryStorage {
  constructor(entries = {}) { this.data = new Map(Object.entries(entries)); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}
class CountingStorage extends MemoryStorage {
  constructor(entries) { super(entries); this.backupWrites = 0; }
  setItem(key, value) {
    if (key.startsWith('precifique:backup:v1:')) this.backupWrites += 1;
    super.setItem(key, value);
  }
}


function createService(storage) {
  const repository = new LocalWorkspaceRepository(storage, () => '2026-08-24T18:00:00.000Z');
  return new WorkspaceService(repository, storage);
}

test('inicializa e migra o workspace do usuário a partir das chaves legadas', async () => {
  const storage = new MemoryStorage({
    produtos: JSON.stringify([{ id: 1, nome: 'Bolo', custo: 10, tempoProducao: 1, quantidadeMes: 2 }]),
    custosFixos: JSON.stringify({ aluguel: 100 }),
    configuracoes: JSON.stringify({ margemLucro: 20, custoHora: 30 }),
  });
  const workspace = await createService(storage).initialize('user-1');
  assert.equal(workspace.ownerId, 'user-1');
  assert.equal(workspace.offers[0].name, 'Bolo');
  assert.equal(workspace.fixedCosts.aluguel, 10000);
});

test('reutiliza workspace existente sem repetir a migração', async () => {
  const storage = new MemoryStorage();
  const service = createService(storage);
  const first = await service.initialize('user-1');
  first.settings.businessName = 'Negócio alterado';
  await service.save('user-1', first);
  const second = await service.initialize('user-1');
  assert.equal(second.settings.businessName, 'Negócio alterado');
  assert.equal([...storage.data.keys()].filter(key => key.startsWith('precifique:backup:v1:')).length, 1);
});

test('atualiza workspace com função imutável e persiste o resultado', async () => {
  const storage = new MemoryStorage();
  const service = createService(storage);
  const workspace = await service.initialize('user-1');
  const updated = await service.update('user-1', workspace, current => ({
    ...current,
    ingredients: [...current.ingredients, { id: 'ingredient-1' }],
  }));
  assert.equal(updated.ingredients.length, 1);
  assert.equal(workspace.ingredients.length, 0);
  assert.equal((await service.initialize('user-1')).ingredients.length, 1);
});

test('exporta o workspace inicializado', async () => {
  const storage = new MemoryStorage();
  const service = createService(storage);
  await service.initialize('user-1');
  assert.equal(JSON.parse(await service.export('user-1')).schemaVersion, 2);
});

test('deduplica inicializações simultâneas do mesmo usuário', async () => {
  const storage = new CountingStorage();
  const service = createService(storage);
  const [first, second] = await Promise.all([
    service.initialize('user-1'),
    service.initialize('user-1'),
  ]);
  assert.deepEqual(second, first);
  assert.equal(storage.backupWrites, 1);
});

test('delega upload e remoção do logo ao repositório remoto', async () => {
  const workspace = { schemaVersion: 2, ownerId: 'user-1', settings: { logo: '' } };
  const repository = {
    async loadWorkspace() { return workspace; },
    async saveWorkspace() { return workspace; },
    async migrateWorkspace() { return workspace; },
    async saveLogo(_ownerId, dataUrl) { return { ...workspace, settings: { logo: dataUrl } }; },
    async deleteLogo() { return workspace; },
  };
  const service = new WorkspaceService(repository, new MemoryStorage());

  assert.equal((await service.saveLogo('user-1', 'data:image/webp;base64,AA==')).settings.logo, 'data:image/webp;base64,AA==');
  assert.equal((await service.deleteLogo('user-1')).settings.logo, '');
});
