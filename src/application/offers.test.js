import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { archiveOffer, createOffer, deleteOffer, updateOffer } from './offers.js';

const NOW = '2026-08-24T21:00:00.000Z';

function workspaceWithIngredients() {
  return {
    ...createEmptyWorkspace('user-1', NOW),
    ingredients: [
      { id: 'flour', ownerId: 'user-1', name: 'Farinha', purchaseUnit: 'kg', active: true },
      { id: 'box', ownerId: 'user-1', name: 'Caixa', purchaseUnit: 'un', active: true },
      { id: 'old', ownerId: 'user-1', name: 'Antigo', purchaseUnit: 'g', active: false },
    ],
  };
}

function product(overrides = {}) {
  return {
    kind: 'product', name: ' Bolo de chocolate ', category: 'Bolos',
    batchYield: 10, batchTimeMinutes: 60, expectedMonthlySales: 20,
    desiredMarginBps: 2500,
    components: [{ ingredientId: 'flour', quantity: 500, unit: 'g', wasteBps: 500 }],
    ...overrides,
  };
}

test('cria produto com componentes identificados sem alterar o workspace original', () => {
  const workspace = workspaceWithIngredients();
  const updated = createOffer(workspace, product(), {
    id: 'offer-1', componentIds: ['component-1'], now: NOW,
  });
  assert.equal(workspace.offers.length, 0);
  assert.deepEqual(updated.offers[0], {
    id: 'offer-1', ownerId: 'user-1', kind: 'product', name: 'Bolo de chocolate',
    category: 'Bolos', active: true, batchYield: 10, batchTimeMinutes: 60,
    expectedMonthlySales: 20, desiredMarginBps: 2500,
    components: [{ id: 'component-1', ingredientId: 'flour', quantity: 500, unit: 'g', wasteBps: 500 }],
    createdAt: NOW, updatedAt: NOW,
  });
});

test('cria serviço sem insumos e força rendimento unitário', () => {
  const updated = createOffer(workspaceWithIngredients(), product({
    kind: 'service', name: 'Consultoria', batchYield: 8, components: [],
  }), { id: 'service-1', now: NOW });
  assert.equal(updated.offers[0].batchYield, 1);
  assert.deepEqual(updated.offers[0].components, []);
});

test('rejeita campos inválidos e componentes incompatíveis', () => {
  const workspace = workspaceWithIngredients();
  assert.throws(() => createOffer(workspace, product({ name: ' ' })), /nome/i);
  assert.throws(() => createOffer(workspace, product({ kind: 'bundle' })), /tipo/i);
  assert.throws(() => createOffer(workspace, product({ batchYield: 0 })), /rendimento/i);
  assert.throws(() => createOffer(workspace, product({ desiredMarginBps: 10001 })), /margem/i);
  assert.throws(() => createOffer(workspace, product({ components: [{ ingredientId: 'missing', quantity: 1, unit: 'g' }] })), /insumo/i);
  assert.throws(() => createOffer(workspace, product({ components: [{ ingredientId: 'flour', quantity: 1, unit: 'ml' }] })), /compatível/i);
  assert.throws(() => createOffer(workspace, product({ components: [{ ingredientId: 'old', quantity: 1, unit: 'g' }] })), /arquivado/i);
});

test('edita oferta preservando identidade, criação e componente arquivado já usado', () => {
  const workspace = {
    ...workspaceWithIngredients(),
    offers: [{
      id: 'offer-1', ownerId: 'user-1', kind: 'product', name: 'Antigo', category: 'Outro',
      active: true, batchYield: 1, batchTimeMinutes: 0, expectedMonthlySales: 0,
      desiredMarginBps: null,
      components: [{ id: 'component-old', ingredientId: 'old', quantity: 10, unit: 'g', wasteBps: 0 }],
      createdAt: NOW, updatedAt: NOW,
    }],
  };
  const later = '2026-08-24T22:00:00.000Z';
  const updated = updateOffer(workspace, 'offer-1', product({
    name: 'Receita histórica', components: [{ id: 'component-old', ingredientId: 'old', quantity: 12, unit: 'g', wasteBps: 0 }],
  }), later);
  assert.equal(updated.offers[0].name, 'Receita histórica');
  assert.equal(updated.offers[0].components[0].id, 'component-old');
  assert.equal(updated.offers[0].createdAt, NOW);
});

test('arquiva e exclui ofertas de forma imutável', () => {
  const workspace = createOffer(workspaceWithIngredients(), product(), { id: 'offer-1', componentIds: ['component-1'], now: NOW });
  assert.equal(archiveOffer(workspace, 'offer-1', NOW).offers[0].active, false);
  assert.equal(deleteOffer(workspace, 'offer-1', NOW).offers.length, 0);
  assert.equal(workspace.offers.length, 1);
});

test('informa quando a oferta não existe', () => {
  const workspace = workspaceWithIngredients();
  assert.throws(() => updateOffer(workspace, 'missing', product(), NOW), /não encontrada/i);
  assert.throws(() => archiveOffer(workspace, 'missing', NOW), /não encontrada/i);
  assert.throws(() => deleteOffer(workspace, 'missing', NOW), /não encontrada/i);
});
