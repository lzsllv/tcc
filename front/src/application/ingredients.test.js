import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { IngredientInUseError, archiveIngredient, createIngredient, deleteIngredient, updateIngredient } from './ingredients.js';

const NOW = '2026-08-24T19:00:00.000Z';
const input = (overrides = {}) => ({ name: ' Farinha de trigo ', category: 'raw-material', purchasePriceCents: 750, purchaseQuantity: 1, purchaseUnit: 'kg', ...overrides });

test('cria um insumo normalizado sem alterar o workspace original', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  const updated = createIngredient(workspace, input(), { id: 'ingredient-1', now: NOW });
  assert.equal(workspace.ingredients.length, 0);
  assert.deepEqual(updated.ingredients[0], { id: 'ingredient-1', ownerId: 'user-1', name: 'Farinha de trigo', category: 'raw-material', purchasePriceCents: 750, purchaseQuantity: 1, purchaseUnit: 'kg', active: true, createdAt: NOW, updatedAt: NOW });
});

test('rejeita dados inválidos no cadastro', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  assert.throws(() => createIngredient(workspace, input({ name: ' ' })), /nome/i);
  assert.throws(() => createIngredient(workspace, input({ category: 'food' })), /categoria/i);
  assert.throws(() => createIngredient(workspace, input({ purchasePriceCents: 1.5 })), /centavos/i);
  assert.throws(() => createIngredient(workspace, input({ purchaseQuantity: 0 })), /quantidade/i);
  assert.throws(() => createIngredient(workspace, input({ purchaseUnit: 'cx' })), /unidade/i);
});

test('edita preservando identidade e data de criação', () => {
  const workspace = createIngredient(createEmptyWorkspace('user-1', NOW), input(), { id: 'ingredient-1', now: NOW });
  const updated = updateIngredient(workspace, 'ingredient-1', input({ name: 'Farinha integral' }), '2026-08-24T20:00:00.000Z');
  assert.equal(updated.ingredients[0].name, 'Farinha integral');
  assert.equal(updated.ingredients[0].createdAt, NOW);
  assert.equal(workspace.ingredients[0].name, 'Farinha de trigo');
});

test('arquiva referenciado, exclui livre e protege histórico', () => {
  const workspace = createIngredient(createEmptyWorkspace('user-1', NOW), input(), { id: 'ingredient-1', now: NOW });
  assert.equal(deleteIngredient(workspace, 'ingredient-1', NOW).ingredients.length, 0);
  const referenced = { ...workspace, offers: [{ components: [{ ingredientId: 'ingredient-1' }] }] };
  assert.equal(archiveIngredient(referenced, 'ingredient-1', NOW).ingredients[0].active, false);
  assert.throws(() => deleteIngredient(referenced, 'ingredient-1', NOW), IngredientInUseError);
});

test('informa quando o insumo não existe', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  assert.throws(() => archiveIngredient(workspace, 'missing', NOW), /não encontrado/i);
  assert.throws(() => updateIngredient(workspace, 'missing', input(), NOW), /não encontrado/i);
});
