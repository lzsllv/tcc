import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { fixedCostsFromView, workspaceToView } from './workspaceView.js';

test('converte workspace em estado monetário de apresentação', () => {
  const workspace = createEmptyWorkspace('user-1');
  workspace.fixedCosts.aluguel = 125_50;
  workspace.settings.businessName = 'Ateliê';

  const view = workspaceToView(workspace);

  assert.equal(view.custosFixos.aluguel, 125.5);
  assert.equal(view.configuracoes.nomeNegocio, 'Ateliê');
});

test('converte custos visuais para centavos sem manter extras vazios', () => {
  const fixedCosts = fixedCostsFromView({
    aluguel: 10.5,
    energia: 0,
    internet: 0,
    salarios: 0,
    outros: 0,
    extras: [
      { id: 'empty', descricao: ' ', valor: 0 },
      { id: 'valid', descricao: 'Gás', valor: 20 },
    ],
  });

  assert.equal(fixedCosts.aluguel, 1050);
  assert.deepEqual(fixedCosts.extras, [{ id: 'valid', name: 'Gás', valueCents: 2000 }]);
});
