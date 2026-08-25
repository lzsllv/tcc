import { getUnitFamily } from '../domain/pricing/units.js';

const CATEGORIES = new Set(['raw-material', 'packaging', 'other']);

export class IngredientInUseError extends Error {
  constructor() {
    super('Este insumo está em uso e não pode ser excluído. Arquive-o para preservar o histórico.');
    this.name = 'IngredientInUseError';
  }
}

function validateWorkspace(workspace) {
  if (!workspace?.ownerId || !Array.isArray(workspace.ingredients) || !Array.isArray(workspace.offers)) {
    throw new TypeError('Workspace inválido para gerenciar insumos.');
  }
}

function normalizeInput(input) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  if (!name) throw new TypeError('Nome do insumo deve ser informado.');
  if (!CATEGORIES.has(input.category)) throw new RangeError('Categoria de insumo inválida.');
  if (!Number.isInteger(input.purchasePriceCents) || input.purchasePriceCents < 0) {
    throw new TypeError('Preço de compra deve ser informado em centavos.');
  }
  if (!Number.isFinite(input.purchaseQuantity) || input.purchaseQuantity <= 0) {
    throw new RangeError('Quantidade de compra deve ser maior que zero.');
  }
  getUnitFamily(input.purchaseUnit);
  return {
    name,
    category: input.category,
    purchasePriceCents: input.purchasePriceCents,
    purchaseQuantity: input.purchaseQuantity,
    purchaseUnit: input.purchaseUnit,
  };
}

function ingredientIndex(workspace, ingredientId) {
  const index = workspace.ingredients.findIndex(ingredient => ingredient.id === ingredientId);
  if (index < 0) throw new RangeError('Insumo não encontrado.');
  return index;
}

function replaceIngredient(workspace, index, ingredient, now) {
  return {
    ...workspace,
    ingredients: workspace.ingredients.map((current, position) => position === index ? ingredient : current),
    updatedAt: now,
  };
}

export function createIngredient(workspace, input, options = {}) {
  validateWorkspace(workspace);
  const now = options.now ?? new Date().toISOString();
  const id = options.id ?? crypto.randomUUID();
  if (workspace.ingredients.some(ingredient => ingredient.id === id)) {
    throw new RangeError('Já existe um insumo com este identificador.');
  }
  const ingredient = {
    id,
    ownerId: workspace.ownerId,
    ...normalizeInput(input),
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  return { ...workspace, ingredients: [...workspace.ingredients, ingredient], updatedAt: now };
}

export function updateIngredient(workspace, ingredientId, input, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = ingredientIndex(workspace, ingredientId);
  const current = workspace.ingredients[index];
  return replaceIngredient(workspace, index, { ...current, ...normalizeInput(input), updatedAt: now }, now);
}

export function archiveIngredient(workspace, ingredientId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = ingredientIndex(workspace, ingredientId);
  return replaceIngredient(workspace, index, { ...workspace.ingredients[index], active: false, updatedAt: now }, now);
}

export function deleteIngredient(workspace, ingredientId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  ingredientIndex(workspace, ingredientId);
  const isReferenced = workspace.offers.some(offer =>
    (offer.components ?? []).some(component => component.ingredientId === ingredientId));
  if (isReferenced) throw new IngredientInUseError();
  return {
    ...workspace,
    ingredients: workspace.ingredients.filter(ingredient => ingredient.id !== ingredientId),
    updatedAt: now,
  };
}
