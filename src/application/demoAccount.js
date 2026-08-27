const DEMO_LOGO = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 48" role="img" aria-label="Doces da Maria"><rect width="160" height="48" rx="10" fill="#7d3f67"/><text x="80" y="30" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#fff">Doces da Maria</text></svg>')}`;
const hasUserEntries = value => Array.isArray(value) ? value.length > 0 : value && typeof value === 'object' ? Object.values(value).some(item => Array.isArray(item) ? item.length > 0 : item !== '' && item !== 0 && item !== null && item !== undefined) : value !== undefined && value !== null && value !== '';
const isInitialLegacySettings = value => value && value.margemLucro === 20 && value.custoHora === 0 && value.regiaoAtuacao === '' && value.nomeNegocio === '' && value.logoNegocio === '' && Object.keys(value).every(key => ['margemLucro', 'custoHora', 'regiaoAtuacao', 'nomeNegocio', 'logoNegocio'].includes(key));
const isInitialWorkspaceSettings = value => value && value.businessName === '' && value.logo === '' && value.region === '' && value.laborHourCents === 0 && value.defaultMarginBps === 0 && value.selectedSalesChannelId === 'channel-direct' && Object.keys(value).every(key => ['businessName', 'logo', 'region', 'laborHourCents', 'defaultMarginBps', 'selectedSalesChannelId'].includes(key));
const isBaselineDirectChannel = (channel, ownerId) => channel && channel.id === 'channel-direct' && channel.ownerId === ownerId && channel.name === 'Venda direta' && channel.active === true && channel.isDefault === true && Array.isArray(channel.fees) && channel.fees.length === 0;

export function isDemoAccountEmpty(account = {}) {
  const workspace = account.workspace ?? account;
  const ownerId = account.ownerId ?? workspace.ownerId;
  const modern = [workspace.ingredients, workspace.offers, workspace.fixedCosts];
  const hasWorkspaceSettings = Object.hasOwn(workspace, 'settings');
  const isWorkspaceV2 = workspace.schemaVersion === 2;
  if (modern.some(hasUserEntries) || ((isWorkspaceV2 || hasWorkspaceSettings) && !isInitialWorkspaceSettings(workspace.settings)) || (workspace.salesChannels ?? []).some(channel => !isBaselineDirectChannel(channel, ownerId))) return false;
  return !(hasUserEntries(account.produtos) || hasUserEntries(account.custosFixos) || (hasUserEntries(account.configuracoes) && !isInitialLegacySettings(account.configuracoes)));
}

const ingredient = (id, ownerId, name, category, price, unit, now) => ({ id, ownerId, name, category, purchasePriceCents: price, purchaseQuantity: 1, purchaseUnit: unit, active: true, createdAt: now, updatedAt: now });
const offer = (id, ownerId, kind, name, category, batchYield, time, sales, components, now) => ({ id, ownerId, kind, name, category, active: true, batchYield, batchTimeMinutes: time, expectedMonthlySales: sales, desiredMarginBps: null, components, createdAt: now, updatedAt: now });

function createLegacyProducts(workspace) {
  const ingredientsById = new Map(workspace.ingredients.map(item => [item.id, item]));
  return workspace.offers.map(item => {
    const totalCents = item.components.reduce((total, component) => {
      const ingredientData = ingredientsById.get(component.ingredientId);
      return total + (ingredientData.purchasePriceCents * component.quantity / ingredientData.purchaseQuantity) * (1 + component.wasteBps / 10000);
    }, 0);
    return {
      id: item.id,
      nome: item.name,
      categoria: item.category,
      custo: Math.max(1, Math.round(totalCents / item.batchYield)) / 100,
      tempoProducao: item.batchTimeMinutes / 60,
      quantidadeMes: item.expectedMonthlySales,
    };
  });
}

function createLegacyFixedCosts(fixedCosts) {
  const result = Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros'].map(key => [key, fixedCosts[key] / 100]));
  result.extras = fixedCosts.extras.map(extra => ({ id: extra.id, nome: extra.name, valor: extra.valueCents / 100 }));
  return result;
}

function createLegacySettings(settings) {
  return {
    margemLucro: settings.defaultMarginBps / 100,
    custoHora: settings.laborHourCents / 100,
    regiaoAtuacao: settings.region,
    nomeNegocio: settings.businessName,
    logoNegocio: settings.logo,
  };
}

export function createDemoAccount(account = {}, now = new Date().toISOString()) {
  if (!isDemoAccountEmpty(account)) throw new RangeError('A conta precisa estar vazia para carregar a demonstração.');
  const ownerId = account.ownerId ?? account.workspace?.ownerId;
  if (typeof ownerId !== 'string' || !ownerId.trim()) throw new TypeError('Proprietário da conta deve ser informado.');
  const ingredients = [
    ingredient('demo-ingredient-flour', ownerId, 'Farinha de trigo', 'raw-material', 520, 'kg', now),
    ingredient('demo-ingredient-sugar', ownerId, 'Açúcar', 'raw-material', 430, 'kg', now),
    ingredient('demo-ingredient-chocolate', ownerId, 'Chocolate', 'raw-material', 3200, 'kg', now),
    ingredient('demo-ingredient-packaging', ownerId, 'Pote e tampa', 'packaging', 85, 'un', now),
  ];
  const components = ids => ids.map((ingredientId, index) => ({ id: `demo-component-${ingredientId}`, ingredientId, quantity: ingredientId === 'demo-ingredient-packaging' ? 1 : [0.12, 0.08, 0.06, 1][index], unit: ingredients.find(item => item.id === ingredientId).purchaseUnit, wasteBps: 0 }));
  const offers = [
    offer('demo-offer-bolo', ownerId, 'product', 'Bolo no pote', 'Alimento', 12, 90, 120, components(['demo-ingredient-flour', 'demo-ingredient-sugar', 'demo-ingredient-packaging']), now),
    offer('demo-offer-brownie', ownerId, 'product', 'Brownie recheado', 'Alimento', 10, 60, 180, components(['demo-ingredient-flour', 'demo-ingredient-sugar', 'demo-ingredient-chocolate', 'demo-ingredient-packaging']), now),
    offer('demo-offer-consultoria', ownerId, 'service', 'Consultoria para pequenos negócios', 'Serviço', 1, 60, 12, [], now),
  ];
  const salesChannels = [
    { id: 'demo-channel-direct', ownerId, name: 'Venda direta', active: true, isDefault: true, fees: [], createdAt: now, updatedAt: now },
    { id: 'demo-channel-instagram', ownerId, name: 'Instagram', active: true, isDefault: false, fees: [{ id: 'demo-fee-instagram', name: 'Taxa de pagamento', kind: 'percentage', category: 'payment', value: 300 }], createdAt: now, updatedAt: now },
    { id: 'demo-channel-delivery', ownerId, name: 'Delivery', active: true, isDefault: false, fees: [{ id: 'demo-fee-delivery', name: 'Taxa da plataforma', kind: 'percentage', category: 'marketplace', value: 1200 }], createdAt: now, updatedAt: now },
  ];
  const workspace = {
    schemaVersion: 2,
    ownerId,
    ingredients,
    offers,
    salesChannels,
    fixedCosts: { aluguel: 65000, energia: 18000, internet: 9000, salarios: 0, outros: 7500, extras: [{ id: 'demo-extra-packaging', name: 'Embalagens e descartáveis', valueCents: 12000 }, { id: 'demo-extra-gas', name: 'Gás de cozinha', valueCents: 8500 }] },
    settings: { businessName: 'Doces da Maria — DEMO', logo: DEMO_LOGO, region: 'Tupã - SP', laborHourCents: 2000, defaultMarginBps: 3500, selectedSalesChannelId: 'demo-channel-direct' },
    updatedAt: now,
  };
  return {
    workspace,
    produtos: createLegacyProducts(workspace),
    custosFixos: createLegacyFixedCosts(workspace.fixedCosts),
    configuracoes: createLegacySettings(workspace.settings),
  };
}

export async function persistDemoAccount(account, persistWorkspace, now = new Date().toISOString()) {
  if (account?.workspaceStatus !== 'ready') {
    throw new RangeError('O workspace precisa estar pronto para carregar a demonstração.');
  }
  if (typeof persistWorkspace !== 'function') {
    throw new TypeError('Persistência do workspace deve ser informada.');
  }
  const demo = createDemoAccount(account, now);
  await persistWorkspace(demo.workspace);
  return demo;
}