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
  const { workspace } = createDemoAccount({ ownerId: 'owner-1' }, now);
  assert.equal(workspace.ownerId, 'owner-1');
  assert.equal(workspace.schemaVersion, 2);
  assert.equal(workspace.ingredients.length, 4);
  assert.equal(workspace.offers.length, 3);
  assert.equal(workspace.offers.filter(item => item.kind === 'product').length, 2);
  assert.equal(workspace.offers.filter(item => item.kind === 'service').length, 1);
  assert.equal(workspace.salesChannels.length, 3);
  assert.ok(workspace.settings.logo.startsWith('data:image/svg+xml,'));
  for (const collection of ['ingredients', 'offers', 'salesChannels']) {
    for (const item of workspace[collection]) assert.equal(item.ownerId, 'owner-1');
  }
  for (const offer of workspace.offers) {
    for (const component of offer.components) assert.ok(workspace.ingredients.some(i => i.id === component.ingredientId));
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
  const { workspace } = createDemoAccount({ ownerId: 'owner-1' }, now);
  const bolo = workspace.offers.find(item => item.id === 'demo-offer-bolo');
  const packaging = bolo.components.find(component => component.ingredientId === 'demo-ingredient-packaging');
  assert.equal(packaging.quantity, 1);
  for (const offer of workspace.offers) for (const component of offer.components) {
    const item = workspace.ingredients.find(ingredient => ingredient.id === component.ingredientId);
    assert.equal(component.unit, item.purchaseUnit);
  }
});

test('aceita a configuração inicial no caminho legado configuracoes e recusa alteração', () => {
  const initial = { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' };
  assert.equal(isDemoAccountEmpty({ ownerId: 'owner-1', configuracoes: initial }), true);
  assert.equal(isDemoAccountEmpty({ ownerId: 'owner-1', configuracoes: { ...initial, nomeNegocio: 'Negócio do usuário' } }), false);
});

test('deriva o pacote legado coerente do workspace demonstrativo', () => {
  const demo = createDemoAccount({ ownerId: 'owner-1' }, now);
  const { workspace, produtos, custosFixos, configuracoes } = demo;

  assert.deepEqual(Object.keys(demo).sort(), ['configuracoes', 'custosFixos', 'produtos', 'workspace']);
  assert.equal(produtos.length, workspace.offers.length);
  for (const offer of workspace.offers) {
    const produto = produtos.find(item => item.id === offer.id);
    assert.ok(produto, 'produto legado para ' + offer.name);
    assert.equal(produto.nome, offer.name);
    assert.equal(produto.categoria, offer.category);
    assert.equal(produto.tempoProducao, offer.batchTimeMinutes / 60);
    assert.equal(produto.quantidadeMes, offer.expectedMonthlySales);
    assert.ok(produto.custo > 0);
  }
  for (const key of ['aluguel', 'energia', 'internet', 'salarios', 'outros']) {
    assert.equal(custosFixos[key], workspace.fixedCosts[key] / 100);
  }
  assert.deepEqual(custosFixos.extras, workspace.fixedCosts.extras.map(extra => ({
    id: extra.id, nome: extra.name, valor: extra.valueCents / 100,
  })));
  assert.deepEqual(configuracoes, {
    margemLucro: 35,
    custoHora: 20,
    regiaoAtuacao: 'Tupã - SP',
    nomeNegocio: 'Doces da Maria — DEMO',
    logoNegocio: workspace.settings.logo,
  });
  assert.match(configuracoes.logoNegocio, /^data:image\/svg\+xml,/);
});
