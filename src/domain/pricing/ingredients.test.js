import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIngredientCost } from './ingredients.js';

const flour = {
  purchasePriceCents: 2000,
  purchaseQuantity: 1,
  purchaseUnit: 'kg',
};

test('calcula o custo proporcional do insumo em outra unidade', () => {
  assert.equal(calculateIngredientCost(flour, 250, 'g', 0), 500);
});

test('inclui a perda percentual no consumo do insumo', () => {
  assert.equal(calculateIngredientCost(flour, 250, 'g', 1000), 550);
});

test('arredonda o custo final para centavos', () => {
  const units = { purchasePriceCents: 1000, purchaseQuantity: 3, purchaseUnit: 'un' };
  assert.equal(calculateIngredientCost(units, 1, 'un', 0), 333);
});

test('rejeita compra sem quantidade e perda fora do intervalo', () => {
  assert.throws(
    () => calculateIngredientCost({ ...flour, purchaseQuantity: 0 }, 250, 'g', 0),
    RangeError,
  );
  assert.throws(() => calculateIngredientCost(flour, 250, 'g', -1), RangeError);
  assert.throws(() => calculateIngredientCost(flour, 250, 'g', 10001), RangeError);
});
