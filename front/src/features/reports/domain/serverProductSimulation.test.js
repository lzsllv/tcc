import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateServerProductSimulation } from './serverProductSimulation.js';

test('simula produtos do servidor com custo direto, mão de obra, rateio e taxas do canal', () => {
  const result = calculateServerProductSimulation({
    product: { custo_direto: '20.00', tempo_producao: '1.5' },
    settings: { custoHora: 10, margemLucro: 20 },
    fixedCosts: { aluguel: 100, extras: [{ valor: 50 }] },
    workspace: {
      salesChannels: [{
        id: 'online',
        active: true,
        isDefault: true,
        fees: [{ kind: 'percentage', value: 1000 }, { kind: 'fixed', value: 100 }],
      }],
    },
    monthlyQuantity: 10,
    salePrice: 50,
  });

  assert.equal(result.suggestedPrice, 72.86);
  assert.equal(result.totalCost, 56);
});

test('aguarda uma quantidade mensal para calcular o preço do produto do servidor', () => {
  assert.deepEqual(calculateServerProductSimulation({
    product: { custo_direto: 20, tempo_producao: 1 },
    settings: { custoHora: 10, margemLucro: 20 },
    monthlyQuantity: '',
  }), { suggestedPrice: null, totalCost: null });
});
