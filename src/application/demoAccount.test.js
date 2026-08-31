import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoAccount, isDemoAccountEmpty } from './demoAccount.js';
import { migrateLegacyData } from '../persistence/migration.js';
import { createEmptyWorkspace } from '../persistence/workspace.js';

const now = '2026-08-25T12:00:00.000Z';
const initialLegacyData = {
  produtos: [],
  custosFixos: { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
  configuracoes: { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' },
};

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



test('aceita o workspace v2 baseline real e recusa cada alteração de settings', () => {
  const workspace = createEmptyWorkspace('owner-1', now);
  assert.equal(isDemoAccountEmpty({ workspace }), true);
  for (const change of [
    { businessName: 'Nome' },
    { logo: 'data:image/svg+xml,x' },
    { region: 'Tupã - SP' },
    { laborHourCents: 1 },
    { defaultMarginBps: 1 },
    { selectedSalesChannelId: 'channel-other' },
    { selectedSalesChannelId: '' },
    { observacao: '' },
  ]) {
    assert.equal(isDemoAccountEmpty({ workspace: { ...workspace, settings: { ...workspace.settings, ...change } } }), false);
  }
  const settingsWithoutChannel = { ...workspace.settings };
  delete settingsWithoutChannel.selectedSalesChannelId;
  assert.equal(isDemoAccountEmpty({ workspace: { ...workspace, settings: settingsWithoutChannel } }), false);
  const workspaceWithoutSettings = { ...workspace };
  delete workspaceWithoutSettings.settings;
  assert.equal(isDemoAccountEmpty({ workspace: workspaceWithoutSettings }), false);
});

test('recusa qualquer divergência estrutural do workspace v2 baseline', async t => {
  const workspace = createEmptyWorkspace('owner-1', now);
  const without = (property, source = workspace) => {
    const candidate = structuredClone(source);
    delete candidate[property];
    return candidate;
  };
  const channel = workspace.salesChannels[0];
  const cases = [
    ['ingredients ausente', without('ingredients')],
    ['ingredients com forma errada', { ...workspace, ingredients: {} }],
    ['offers ausente', without('offers')],
    ['offers com forma errada', { ...workspace, offers: {} }],
    ['fixedCosts ausente', without('fixedCosts')],
    ['fixedCosts vazio', { ...workspace, fixedCosts: {} }],
    ['fixedCosts sem aluguel', { ...workspace, fixedCosts: without('aluguel', workspace.fixedCosts) }],
    ['fixedCosts sem extras', { ...workspace, fixedCosts: without('extras', workspace.fixedCosts) }],
    ['fixedCosts com extras na forma errada', { ...workspace, fixedCosts: { ...workspace.fixedCosts, extras: {} } }],
    ['fixedCosts com campo extra vazio', { ...workspace, fixedCosts: { ...workspace.fixedCosts, observacao: '' } }],
    ['salesChannels ausente', without('salesChannels')],
    ['salesChannels vazio', { ...workspace, salesChannels: [] }],
    ['salesChannels com canal adicional', { ...workspace, salesChannels: [...workspace.salesChannels, structuredClone(channel)] }],
    ['canal sem nome', { ...workspace, salesChannels: [without('name', channel)] }],
    ['canal sem fees', { ...workspace, salesChannels: [without('fees', channel)] }],
    ['canal com fees na forma errada', { ...workspace, salesChannels: [{ ...channel, fees: {} }] }],
    ['canal com campo extra vazio', { ...workspace, salesChannels: [{ ...channel, observacao: '' }] }],
  ];

  for (const [description, candidate] of cases) {
    await t.test(description, () => {
      assert.equal(isDemoAccountEmpty({ workspace: candidate }), false);
    });
  }
});

test('aceita workspace migrado somente junto das três estruturas legadas iniciais completas', () => {
  const workspace = migrateLegacyData('owner-1', initialLegacyData, now);

  assert.equal(isDemoAccountEmpty({ workspace, ...structuredClone(initialLegacyData) }), true);
});

test('mantém a proteção geral para variações da conta migrada inicial', () => {
  const workspace = migrateLegacyData('owner-1', initialLegacyData, now);
  const account = { workspace, ...structuredClone(initialLegacyData) };
  const withoutSettings = structuredClone(account);
  delete withoutSettings.configuracoes;
  const cases = [
    withoutSettings,
    { ...account, configuracoes: { ...account.configuracoes, nomeNegocio: 'Negócio do usuário' } },
    { ...account, configuracoes: { ...account.configuracoes, observacao: '' } },
    { ...account, workspace: { ...workspace, settings: { ...workspace.settings, defaultMarginBps: workspace.settings.defaultMarginBps + 1 } } },
    { ...account, workspace: { ...workspace, settings: { ...workspace.settings, observacao: '' } } },
    { ...account, workspace: { ...workspace, settings: { ...workspace.settings, laborHourCents: 1 } } },
    { ...account, workspace: { ...workspace, fixedCosts: { ...workspace.fixedCosts, aluguel: 1 } } },
    { ...account, workspace: { ...workspace, ingredients: [{ id: 'ingredient-1' }] } },
    { ...account, workspace: { ...workspace, offers: [{ id: 'offer-1' }] } },
    { ...account, workspace: { ...workspace, salesChannels: [...workspace.salesChannels, { id: 'channel-other' }] } },
    { ...account, produtos: [{ id: 'product-1' }] },
    { ...account, custosFixos: { ...account.custosFixos, aluguel: 1 } },
  ];

  for (const candidate of cases) assert.equal(isDemoAccountEmpty(candidate), false);
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

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((success, failure) => { resolve = success; reject = failure; });
  return { promise, resolve, reject };
}

function emptyDemoInput(status = 'ready') {
  return {
    workspaceStatus: status,
    workspace: createEmptyWorkspace('owner-1', now),
    produtos: [],
    custosFixos: { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
    configuracoes: { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' },
  };
}

test('recusa carregar demonstração quando o workspace não está pronto', async () => {
  const { persistDemoAccount } = await import('./demoAccount.js');
  assert.equal(typeof persistDemoAccount, 'function');
  let persisted = false;
  await assert.rejects(
    () => persistDemoAccount(emptyDemoInput('saving'), async () => { persisted = true; }),
    /pronto/i,
  );
  assert.equal(persisted, false);
});

test('só devolve o pacote legado depois da persistência do workspace', async () => {
  const { persistDemoAccount } = await import('./demoAccount.js');
  assert.equal(typeof persistDemoAccount, 'function');
  const gate = deferred();
  const events = [];
  const result = persistDemoAccount(emptyDemoInput(), workspace => {
    events.push(['persist', workspace]);
    return gate.promise;
  }, now);
  let returned = false;
  result.then(() => { returned = true; });
  await Promise.resolve();
  assert.equal(events.length, 1);
  assert.equal(returned, false);
  gate.resolve();
  const demo = await result;
  assert.equal(events[0][1], demo.workspace);
  assert.ok(demo.produtos.length > 0);
});

test('propaga falha de persistência sem devolver pacote legado', async () => {
  const { persistDemoAccount } = await import('./demoAccount.js');
  assert.equal(typeof persistDemoAccount, 'function');
  const failure = new Error('falha de gravação');
  let returned = false;
  const result = persistDemoAccount(emptyDemoInput(), async () => { throw failure; }, now);
  result.then(() => { returned = true; }, () => {});
  await assert.rejects(() => result, failure);
  assert.equal(returned, false);
});
