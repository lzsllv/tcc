import test from 'node:test';
import assert from 'node:assert/strict';
import { sessionUser } from './session.js';

test('mapeia sessão local para o usuário consumido pela aplicação', () => {
  assert.deepEqual(sessionUser({ user: { id: 'user-1', email: 'ana@example.com', name: 'Ana' } }), {
    id: 'user-1', email: 'ana@example.com', nome: 'Ana',
  });
  assert.equal(sessionUser(null), null);
});
