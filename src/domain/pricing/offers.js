import { calculateIngredientCost } from './ingredients.js';

function assertNonNegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} deve ser um número não negativo.`);
  }
}

export function calculateOfferVariableCost(offer, ingredientsById, laborHourCents) {
  const { batchYield, batchTimeMinutes = 0, components = [] } = offer ?? {};
  if (!Number.isFinite(batchYield) || batchYield <= 0) {
    throw new RangeError('Rendimento do lote deve ser maior que zero.');
  }
  assertNonNegative(batchTimeMinutes, 'Tempo do lote');
  assertNonNegative(laborHourCents, 'Custo da hora');

  const materialCostCents = components.reduce((total, component) => {
    const ingredient = ingredientsById?.[component.ingredientId];
    if (!ingredient) {
      throw new ReferenceError(`Insumo não encontrado: ${component.ingredientId}.`);
    }
    return total + calculateIngredientCost(
      ingredient,
      component.quantity,
      component.unit,
      component.wasteBps ?? 0,
    );
  }, 0);

  const laborCostCents = Math.round((batchTimeMinutes / 60) * laborHourCents);
  const batchCostCents = materialCostCents + laborCostCents;
  const unitCostCents = Math.round(batchCostCents / batchYield);

  return { materialCostCents, laborCostCents, batchCostCents, unitCostCents };
}
