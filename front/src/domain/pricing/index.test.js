import test from 'node:test';
import assert from 'node:assert/strict';
import * as pricing from './index.js';

test('expõe a API pública completa do domínio financeiro', () => {
  const expectedFunctions = [
    'calculateFixedCostAllocation',
    'calculateIngredientCost',
    'calculateOfferBreakEven',
    'calculateOfferVariableCost',
    'calculatePriceReferences',
    'calculateUnitContribution',
    'calculateWeightedBreakEven',
    'convertQuantity',
    'formatCents',
    'getUnitFamily',
    'markupBpsToMarginBps',
    'parseMoneyToCents',
    'percentToBps',
  ];
  assert.deepEqual(Object.keys(pricing).sort(), expectedFunctions);
});
