import test from 'node:test';
import assert from 'node:assert/strict';
import { createPricingView } from './pricingView.js';

test('preserva totais e preços com valores numéricos ou textuais', () => {
  const pricing = createPricingView(
    [{ custo: '10', tempoProducao: '2', quantidadeMes: '5' }],
    { aluguel: '100', energia: 0, internet: 0, salarios: 0, outros: 0, extras: [{ valor: '50' }] },
    { custoHora: '20', margemLucro: '20' },
  );

  assert.equal(pricing.totalFixedCosts(), 150);
  assert.equal(pricing.totalMonthlyUnits(), 5);
  assert.equal(pricing.fixedCostPerUnit(), 30);
  assert.equal(pricing.fixedCostPerProduct(), 150);
  assert.equal(pricing.totalProductCost({ custo: '10', tempoProducao: '2' }), 80);
  assert.equal(pricing.suggestedPrice({ custo: '10', tempoProducao: '2' }), 100);
  assert.equal(pricing.monthlyProfit(100, 80, 5), 100);
});

test('preserva os limites para listas vazias e margem inviável', () => {
  const empty = createPricingView([], { extras: [] }, { custoHora: 0, margemLucro: 100 });

  assert.equal(empty.totalMonthlyUnits(), 1);
  assert.equal(empty.fixedCostPerProduct(), 0);
  assert.equal(empty.suggestedPrice({ custo: 10, tempoProducao: 0 }), 0);
});
