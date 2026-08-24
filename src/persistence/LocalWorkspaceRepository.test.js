import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalWorkspaceRepository } from './LocalWorkspaceRepository.js';
import { createEmptyWorkspace } from './workspace.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}

test('salva e carrega workspaces separados por usuário de forma assíncrona', async () => {
  const storage = new MemoryStorage();
  const repository = new LocalWorkspaceRepository(storage, () => '2026-08-24T13:00:00.000Z');
  const first = createEmptyWorkspace('user-1', '2026-08-24T12:00:00.000Z');
  const second = createEmptyWorkspace('user-2', '2026-08-24T12:00:00.000Z');
  first.ingredients.push({ id: 'ingredient-1' });

  await repository.saveWorkspace('user-1', first);
  await repository.saveWorkspace('user-2', second);

  assert.equal((await repository.loadWorkspace('user-1')).ingredients.length, 1);
  assert.equal((await repository.loadWorkspace('user-2')).ingredients.length, 0);
  assert.equal((await repository.loadWorkspace('missing')), null);
});

test('não permite salvar workspace de outro proprietário', async () => {
  const repository = new LocalWorkspaceRepository(new MemoryStorage());
  await assert.rejects(
    repository.saveWorkspace('user-1', createEmptyWorkspace('user-2')),
    TypeError,
  );
});

test('cria backup e exporta uma cópia serializada', async () => {
  const storage = new MemoryStorage();
  const repository = new LocalWorkspaceRepository(storage, () => '2026-08-24T14:00:00.000Z');
  const workspace = createEmptyWorkspace('user-1');
  const backupKey = await repository.createBackup('user-1', { produtos: [{ id: 1 }] });
  await repository.saveWorkspace('user-1', workspace);

  assert.equal(backupKey, 'precifique:backup:v1:2026-08-24T14:00:00.000Z');
  assert.deepEqual(JSON.parse(storage.getItem(backupKey)), { ownerId: 'user-1', produtos: [{ id: 1 }] });
  assert.equal(JSON.parse(await repository.exportWorkspace('user-1')).ownerId, 'user-1');
});

test('propaga falha de gravação sem apagar dados existentes', async () => {
  const storage = new MemoryStorage();
  const repository = new LocalWorkspaceRepository(storage);
  const original = createEmptyWorkspace('user-1');
  await repository.saveWorkspace('user-1', original);
  storage.setItem = () => { throw new Error('quota'); };

  await assert.rejects(repository.saveWorkspace('user-1', original), /quota/);
  assert.equal((await repository.loadWorkspace('user-1')).ownerId, 'user-1');
});
