import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOfferBreakEven,
  calculateUnitContribution,
  calculateWeightedBreakEven,
} from './breakEven.js';

test('calcula contribuição unitária após taxas e custo variável', () => {
  assert.equal(calculateUnitContribution({
    priceCents: 3000,
    percentageFeesBps: 1000,
    fixedFeesCents: 200,
    variableCostCents: 1500,
  }), 1000);
});

test('preserva contribuição nula ou negativa para sinalizar venda inviável', () => {
  assert.equal(calculateUnitContribution({
    priceCents: 1000,
    percentageFeesBps: 0,
    fixedFeesCents: 0,
    variableCostCents: 1000,
  }), 0);
  assert.equal(calculateUnitContribution({
    priceCents: 900,
    percentageFeesBps: 0,
    fixedFeesCents: 0,
    variableCostCents: 1000,
  }), -100);
});

test('arredonda para cima o ponto de equilíbrio individual', () => {
  assert.equal(calculateOfferBreakEven({ totalFixedCostsCents: 10000, unitContributionCents: 1200 }), 9);
});

test('retorna indisponível quando a contribuição não é positiva', () => {
  assert.equal(calculateOfferBreakEven({ totalFixedCostsCents: 10000, unitContributionCents: 0 }), null);
  assert.equal(calculateOfferBreakEven({ totalFixedCostsCents: 10000, unitContributionCents: -1 }), null);
});

test('calcula equilíbrio do mix pela contribuição média ponderada', () => {
  assert.equal(calculateWeightedBreakEven({
    totalFixedCostsCents: 5000,
    offers: [
      { unitContributionCents: 1000, expectedMonthlySales: 10 },
      { unitContributionCents: 500, expectedMonthlySales: 30 },
    ],
  }), 8);
});

test('retorna indisponível para mix sem quantidades ou contribuição positiva', () => {
  assert.equal(calculateWeightedBreakEven({ totalFixedCostsCents: 5000, offers: [] }), null);
  assert.equal(calculateWeightedBreakEven({
    totalFixedCostsCents: 5000,
    offers: [{ unitContributionCents: 0, expectedMonthlySales: 10 }],
  }), null);
});
