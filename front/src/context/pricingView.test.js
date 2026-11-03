import test from 'node:test';
import assert from 'node:assert/strict';
import { createPricingView } from './pricingView.js';
import { createEmptyWorkspace } from '../features/workspace/persistence/workspace.js';
import { workspaceToView } from './workspaceView.js';
import { priceOfferForChannel } from '../features/offers/services/offerPricing.js';

test('usa o mesmo preço do produto com taxas, mão de obra e margem específica', () => {
  const workspace = createEmptyWorkspace('pricing-user');
  workspace.fixedCosts.aluguel = 10000;
  workspace.settings.laborHourCents = 1000;
  workspace.settings.defaultMarginBps = 4000;
  workspace.offers = [{ id: 'offer', active: true, name: 'Serviço', category: 'Teste',
    batchYield: 1, batchTimeMinutes: 60, expectedMonthlySales: 10,
    desiredMarginBps: 2000, components: [] }];
  const channel = workspace.salesChannels[0];
  channel.fees = [{ kind: 'percentage', value: 1000 }, { kind: 'fixed', value: 100 }];
  const view = workspaceToView(workspace);
  const pricing = createPricingView(view.produtos, view.custosFixos, view.configuracoes, workspace);
  const product = view.produtos[0];
  assert.equal(pricing.suggestedPrice(product), 30);
  assert.equal(pricing.suggestedPrice(product), priceOfferForChannel(workspace, 'offer', channel.id).prices.recommendedPriceCents / 100);
  assert.equal(pricing.totalProductCost(product), 24);
  assert.equal(pricing.totalProductCost(product, 40), 25);

  const direct = { id: 'direct', active: true, isDefault: false, fees: [] };
  workspace.salesChannels.push(direct);
  workspace.settings.selectedSalesChannelId = direct.id;
  assert.equal(pricing.suggestedPrice(product), 25);
  workspace.settings.selectedSalesChannelId = channel.id;
  workspace.offers[0].desiredMarginBps = 9000;
  assert.equal(pricing.suggestedPrice(product), null);
  workspace.offers[0].desiredMarginBps = 2000;

  workspace.offers[0].expectedMonthlySales = 0;
  assert.equal(pricing.suggestedPrice(product), null);
  assert.equal(pricing.totalProductCost(product), null);
});

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

  assert.equal(empty.totalMonthlyUnits(), 0);
  assert.equal(empty.fixedCostPerProduct(), 0);
  assert.equal(empty.suggestedPrice({ custo: 10, tempoProducao: 0 }), null);
  assert.equal(empty.fixedCostPerUnit(), null);
});

test('preserva o fallback quando extras recebe um valor vazio', () => {
  const pricing = createPricingView([], { aluguel: 100, extras: '' }, { custoHora: 0, margemLucro: 20 });

  assert.equal(pricing.totalFixedCosts(), 100);
});
