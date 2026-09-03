import test from 'node:test';
import assert from 'node:assert/strict';
import { initialWorkspaceState, workspaceReducer } from './workspaceState.js';

test('representa o ciclo de carregamento até o workspace ficar pronto', () => {
  const loading = workspaceReducer(initialWorkspaceState, { type: 'loadStarted' });
  assert.deepEqual(loading, { data: null, status: 'loading', error: null });
  const ready = workspaceReducer(loading, { type: 'loadSucceeded', workspace: { ownerId: 'user-1' } });
  assert.deepEqual(ready, { data: { ownerId: 'user-1' }, status: 'ready', error: null });
});

test('mantém os dados durante salvamento e atualiza após sucesso', () => {
  const ready = { data: { value: 1 }, status: 'ready', error: null };
  const saving = workspaceReducer(ready, { type: 'saveStarted' });
  assert.deepEqual(saving, { data: { value: 1 }, status: 'saving', error: null });
  const saved = workspaceReducer(saving, { type: 'saveSucceeded', workspace: { value: 2 } });
  assert.deepEqual(saved, { data: { value: 2 }, status: 'ready', error: null });
});

test('preserva o último workspace quando leitura ou gravação falha', () => {
  const ready = { data: { value: 1 }, status: 'saving', error: null };
  assert.deepEqual(workspaceReducer(ready, { type: 'failed', error: new Error('quota') }), {
    data: { value: 1 },
    status: 'error',
    error: 'quota',
  });
});

test('limpa workspace e erro no logout', () => {
  assert.deepEqual(workspaceReducer({ data: {}, status: 'error', error: 'falha' }, { type: 'reset' }), initialWorkspaceState);
});
