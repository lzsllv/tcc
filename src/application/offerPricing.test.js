import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import { priceOfferForChannel } from './offerPricing.js';

const NOW = '2026-08-25T14:00:00.000Z';

function workspaceFixture() {
  const workspace = createEmptyWorkspace('user-1', NOW);
  workspace.ingredients = [{
    id: 'flour', ownerId: 'user-1', name: 'Farinha', category: 'raw-material',
    purchasePriceCents: 1000, purchaseQuantity: 1, purchaseUnit: 'kg', active: true,
    createdAt: NOW, updatedAt: NOW,
  }];
  workspace.offers = [{
    id: 'offer-1', ownerId: 'user-1', kind: 'product', name: 'Bolo', category: 'Bolos', active: true,
    batchYield: 1, batchTimeMinutes: 0, expectedMonthlySales: 9, desiredMarginBps: null,
    components: [{ id: 'component-1', ingredientId: 'flour', quantity: 100, unit: 'g', wasteBps: 0 }],
    createdAt: NOW, updatedAt: NOW,
  }];
  workspace.fixedCosts.aluguel = 9000;
  workspace.settings.defaultMarginBps = 2000;
  workspace.salesChannels.push({
    id: 'channel-card', ownerId: 'user-1', name: 'Cartão', active: true, isDefault: false,
    fees: [
      { id: 'fee-1', name: 'Crédito', kind: 'percentage', category: 'payment', value: 1000 },
      { id: 'fee-2', name: 'Tarifa', kind: 'fixed', category: 'payment', value: 50 },
    ], createdAt: NOW, updatedAt: NOW,
  });
  return workspace;
}

test('calcula custos e três referências para a oferta no canal', () => {
  const result = priceOfferForChannel(workspaceFixture(), 'offer-1', 'channel-card');
  assert.deepEqual(result.costs, {
    materialCostCents: 100, laborCostCents: 0, batchCostCents: 100, unitCostCents: 100,
  });
  assert.equal(result.fixedAllocationCents, 1000);
  assert.equal(result.marginBps, 2000);
  assert.deepEqual(result.fees, { percentageFeesBps: 1000, fixedFeesCents: 50 });
  assert.deepEqual(result.prices, {
    minimumPriceCents: 167, sustainablePriceCents: 1278, recommendedPriceCents: 1643,
  });
});

test('usa margem específica da oferta no lugar da margem padrão', () => {
  const workspace = workspaceFixture();
  workspace.offers[0].desiredMarginBps = 3000;
  assert.equal(priceOfferForChannel(workspace, 'offer-1', 'channel-card').prices.recommendedPriceCents, 1917);
});

test('mantém preço mínimo quando não existe planejamento mensal', () => {
  const workspace = workspaceFixture();
  workspace.offers[0].expectedMonthlySales = 0;
  const result = priceOfferForChannel(workspace, 'offer-1', 'channel-card');
  assert.equal(result.fixedAllocationCents, null);
  assert.deepEqual(result.prices, {
    minimumPriceCents: 167, sustainablePriceCents: null, recommendedPriceCents: null,
  });
});

test('recalcula preços quando insumo, custo fixo, mão de obra ou canal muda', () => {
  const workspace = workspaceFixture();
  const initial = priceOfferForChannel(workspace, 'offer-1', 'channel-card').prices;
  const changed = structuredClone(workspace);
  changed.ingredients[0].purchasePriceCents = 2000;
  changed.fixedCosts.aluguel = 18000;
  changed.settings.laborHourCents = 6000;
  changed.offers[0].batchTimeMinutes = 60;
  changed.salesChannels[1].fees[0].value = 1500;
  const recalculated = priceOfferForChannel(changed, 'offer-1', 'channel-card').prices;
  assert.notEqual(recalculated.minimumPriceCents, initial.minimumPriceCents);
  assert.notEqual(recalculated.sustainablePriceCents, initial.sustainablePriceCents);
  assert.notEqual(recalculated.recommendedPriceCents, initial.recommendedPriceCents);
});

test('soma custos fixos extras e ignora ofertas arquivadas no rateio', () => {
  const workspace = workspaceFixture();
  workspace.fixedCosts.extras = [{ id: 'extra-1', name: 'Seguro', valueCents: 900 }];
  workspace.offers.push({ ...workspace.offers[0], id: 'archived', active: false, expectedMonthlySales: 90 });
  assert.equal(priceOfferForChannel(workspace, 'offer-1', 'channel-card').fixedAllocationCents, 1100);
});

test('rejeita oferta ou canal ausente e canal arquivado', () => {
  const workspace = workspaceFixture();
  assert.throws(() => priceOfferForChannel(workspace, 'missing', 'channel-card'), /oferta/i);
  assert.throws(() => priceOfferForChannel(workspace, 'offer-1', 'missing'), /canal/i);
  workspace.salesChannels[1].active = false;
  assert.throws(() => priceOfferForChannel(workspace, 'offer-1', 'channel-card'), /ativo/i);
});

test('explica denominador inválido de margem e taxas', () => {
  const workspace = workspaceFixture();
  workspace.settings.defaultMarginBps = 9000;
  assert.throws(() => priceOfferForChannel(workspace, 'offer-1', 'channel-card'), /taxas e margem/i);
});
