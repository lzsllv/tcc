import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFixedCostAllocation } from './allocation.js';

test('rateia custos fixos somente entre vendas mensais positivas', () => {
  const offers = [
    { expectedMonthlySales: 10 },
    { expectedMonthlySales: 30 },
    { expectedMonthlySales: 0 },
  ];
  assert.equal(calculateFixedCostAllocation(10000, offers), 250);
});

test('retorna indisponível quando não há quantidade mensal válida', () => {
  assert.equal(calculateFixedCostAllocation(10000, []), null);
  assert.equal(calculateFixedCostAllocation(10000, [{ expectedMonthlySales: 0 }]), null);
});

test('rejeita custos e quantidades negativas', () => {
  assert.throws(() => calculateFixedCostAllocation(-1, []), RangeError);
  assert.throws(
    () => calculateFixedCostAllocation(1000, [{ expectedMonthlySales: -1 }]),
    RangeError,
  );
});
