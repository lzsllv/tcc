import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePriceReferences } from './prices.js';

const input = {
  variableCostCents: 1000,
  fixedAllocationCents: 500,
  percentageFeesBps: 1000,
  fixedFeesCents: 100,
  desiredMarginBps: 2000,
};

test('calcula preços mínimo, sustentável e recomendado', () => {
  assert.deepEqual(calculatePriceReferences(input), {
    minimumPriceCents: 1222,
    sustainablePriceCents: 1778,
    recommendedPriceCents: 2286,
  });
});

test('funciona sem taxas e sem margem', () => {
  assert.deepEqual(calculatePriceReferences({
    variableCostCents: 1000,
    fixedAllocationCents: 500,
    percentageFeesBps: 0,
    fixedFeesCents: 0,
    desiredMarginBps: 0,
  }), {
    minimumPriceCents: 1000,
    sustainablePriceCents: 1500,
    recommendedPriceCents: 1500,
  });
});

test('rejeita denominador de preço inválido', () => {
  assert.throws(
    () => calculatePriceReferences({ ...input, percentageFeesBps: 8000, desiredMarginBps: 2000 }),
    RangeError,
  );
});

test('rejeita valores monetários e percentuais negativos', () => {
  assert.throws(() => calculatePriceReferences({ ...input, variableCostCents: -1 }), RangeError);
  assert.throws(() => calculatePriceReferences({ ...input, percentageFeesBps: -1 }), RangeError);
});
