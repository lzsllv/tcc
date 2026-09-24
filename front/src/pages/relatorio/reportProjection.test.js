import test from 'node:test';
import assert from 'node:assert/strict';
import { createReportProjection } from './reportProjection.js';

test('calcula receita e lucro preservando quantidades textuais ou vazias', () => {
  const products = [
    { id: 'a', quantidadeMes: '2' },
    { id: 'b', quantidadeMes: '' },
  ];

  const projection = createReportProjection(
    products,
    () => 100,
    () => 2,
    () => 50,
    product => product.id === 'a' ? 60 : 20,
    product => product.id === 'a' ? 75 : 30,
  );

  assert.deepEqual(projection, {
    totalCosts: 100,
    totalUnits: 2,
    fixedCostPerUnit: 50,
    zeroCosts: false,
    totalRevenue: 150,
    totalProfit: 30,
  });
});

test('preserva zero como limite para relatório vazio', () => {
  const projection = createReportProjection(
    [],
    () => 0,
    () => 0,
    () => 0,
    () => 0,
    () => 0,
  );

  assert.deepEqual(projection, {
    totalCosts: 0,
    totalUnits: 0,
    fixedCostPerUnit: 0,
    zeroCosts: true,
    totalRevenue: 0,
    totalProfit: 0,
  });
});
