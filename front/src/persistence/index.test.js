import test from 'node:test';
import assert from 'node:assert/strict';
import * as persistence from './index.js';

test('expõe o contrato público da persistência local', () => {
  assert.deepEqual(Object.keys(persistence).sort(), [
    'LocalWorkspaceRepository',
    'WORKSPACE_SCHEMA_VERSION',
    'assertOwnerId',
    'assertWorkspace',
    'createEmptyWorkspace',
    'migrateLegacyData',
  ]);
});
