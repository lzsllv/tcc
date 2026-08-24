import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from './workspace.js';

test('cria workspace v2 isolado pelo proprietário', () => {
  const workspace = createEmptyWorkspace('user-1', '2026-08-24T12:00:00.000Z');
  assert.equal(workspace.schemaVersion, 2);
  assert.equal(workspace.ownerId, 'user-1');
  assert.deepEqual(workspace.ingredients, []);
  assert.deepEqual(workspace.offers, []);
  assert.equal(workspace.salesChannels.length, 1);
  assert.equal(workspace.salesChannels[0].name, 'Venda direta');
  assert.equal(workspace.salesChannels[0].isDefault, true);
  assert.equal(workspace.updatedAt, '2026-08-24T12:00:00.000Z');
});

test('rejeita criação sem proprietário', () => {
  assert.throws(() => createEmptyWorkspace(''), TypeError);
});
