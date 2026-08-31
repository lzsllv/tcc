import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOfferVariableCost } from './offers.js';

const ingredients = {
  flour: { purchasePriceCents: 2000, purchaseQuantity: 1, purchaseUnit: 'kg' },
  box: { purchasePriceCents: 1000, purchaseQuantity: 10, purchaseUnit: 'un' },
};

test('soma materiais e mão de obra e divide pelo rendimento', () => {
  const offer = {
    batchYield: 10,
    batchTimeMinutes: 120,
    components: [
      { ingredientId: 'flour', quantity: 250, unit: 'g', wasteBps: 0 },
      { ingredientId: 'box', quantity: 1, unit: 'un', wasteBps: 0 },
    ],
  };

  assert.deepEqual(calculateOfferVariableCost(offer, ingredients, 3000), {
    materialCostCents: 600,
    laborCostCents: 6000,
    batchCostCents: 6600,
    unitCostCents: 660,
  });
});

test('precifica serviço somente pelo tempo de trabalho', () => {
  const service = { batchYield: 1, batchTimeMinutes: 90, components: [] };
  assert.equal(calculateOfferVariableCost(service, {}, 4000).unitCostCents, 6000);
});

test('rejeita rendimento nulo e insumo inexistente', () => {
  assert.throws(
    () => calculateOfferVariableCost({ batchYield: 0, batchTimeMinutes: 0, components: [] }, {}, 0),
    RangeError,
  );
  assert.throws(
    () => calculateOfferVariableCost({ batchYield: 1, batchTimeMinutes: 0, components: [{ ingredientId: 'missing', quantity: 1, unit: 'un', wasteBps: 0 }] }, {}, 0),
    ReferenceError,
  );
});
