import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoAccount, isDemoAccountEmpty } from './demoAccount.js';

const now = '2026-08-25T12:00:00.000Z';

test('considera vazia uma conta sem dados modernos nem legados', () => {
  assert.equal(isDemoAccountEmpty({}), true);
  assert.equal(isDemoAccountEmpty({ workspace: null, produtos: [], custosFixos: {}, configuracoes: {} }), true);
});

test('recusa conta com qualquer dado moderno ou legado', () => {
  const cases = [
    { workspace: { ingredients: [{}] } },
    { workspace: { offers: [{}] } },
    { workspace: { salesChannels: [{ id: 'x' }] } },
    { workspace: { fixedCosts: { aluguel: 1 } } },
    { workspace: { settings: { businessName: 'x' } } },
    { produtos: [{}] },
    { custosFixos: { aluguel: 1 } },
    { configuracoes: { nomeNegocio: 'x' } },
  ];
  for (const account of cases) assert.equal(isDemoAccountEmpty(account), false);
});

test('gera conta demonstrativa determinística, completa e do proprietário', () => {
  const account = createDemoAccount({ ownerId: 'owner-1' }, now);
  assert.equal(account.ownerId, 'owner-1');
  assert.equal(account.schemaVersion, 2);
  assert.equal(account.ingredients.length, 4);
  assert.equal(account.offers.length, 3);
  assert.equal(account.offers.filter(item => item.kind === 'product').length, 2);
  assert.equal(account.offers.filter(item => item.kind === 'service').length, 1);
  assert.equal(account.salesChannels.length, 3);
  assert.ok(account.settings.logo.startsWith('<svg'));
  for (const collection of ['ingredients', 'offers', 'salesChannels']) {
    for (const item of account[collection]) assert.equal(item.ownerId, 'owner-1');
  }
  for (const offer of account.offers) {
    for (const component of offer.components) assert.ok(account.ingredients.some(i => i.id === component.ingredientId));
  }
});

test('não muta entrada e protege conta não vazia', () => {
  const empty = { ownerId: 'owner-1', workspace: null, produtos: [], custosFixos: {}, configuracoes: {} };
  const snapshot = structuredClone(empty);
  assert.deepEqual(createDemoAccount(empty, now), createDemoAccount(empty, now));
  assert.deepEqual(empty, snapshot);
  assert.throws(() => createDemoAccount({ ownerId: 'owner-1', produtos: [{ id: 1 }] }, now), /vazia/i);
});



test('aceita apenas o canal direto baseline e a configuração inicial legada', () => {
  assert.equal(isDemoAccountEmpty({ ownerId: 'owner-1', salesChannels: [{ id: 'channel-direct', ownerId: 'owner-1', name: 'Venda direta', active: true, isDefault: true, fees: [], createdAt: 'a', updatedAt: 'b' }], settings: { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' } }), true);
  for (const change of [{ name: 'Outra' }, { active: false }, { isDefault: false }, { fees: [{ value: 1 }] }]) {
    const channel = { id: 'channel-direct', ownerId: 'owner-1', name: 'Venda direta', active: true, isDefault: true, fees: [], ...change };
    assert.equal(isDemoAccountEmpty({ ownerId: 'owner-1', salesChannels: [channel] }), false);
  }
});

test('mantém embalagem coerente e unidades compatíveis', () => {
  const account = createDemoAccount({ ownerId: 'owner-1' }, now);
  const bolo = account.offers.find(item => item.id === 'demo-offer-bolo');
  const packaging = bolo.components.find(component => component.ingredientId === 'demo-ingredient-packaging');
  assert.equal(packaging.quantity, 1);
  for (const offer of account.offers) for (const component of offer.components) {
    const item = account.ingredients.find(ingredient => ingredient.id === component.ingredientId);
    assert.equal(component.unit, item.purchaseUnit);
  }
});
