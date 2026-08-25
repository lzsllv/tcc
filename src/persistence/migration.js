import { markupBpsToMarginBps, parseMoneyToCents, percentToBps } from '../domain/pricing/index.js';
import { createEmptyWorkspace } from './workspace.js';

function money(value) {
  return parseMoneyToCents(Number(value || 0));
}

export function migrateLegacyData(ownerId, legacyData, timestamp) {
  const workspace = createEmptyWorkspace(ownerId, timestamp);
  const products = legacyData?.produtos ?? [];

  for (const product of products) {
    const sourceId = String(product.id);
    const ingredientId = `legacy-ingredient-${sourceId}`;
    const offerId = `legacy-offer-${sourceId}`;
    workspace.ingredients.push({
      id: ingredientId,
      ownerId,
      name: `Custo direto anterior - ${product.nome}`,
      category: 'other',
      purchasePriceCents: money(product.custo),
      purchaseQuantity: 1,
      purchaseUnit: 'un',
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    workspace.offers.push({
      id: offerId,
      ownerId,
      kind: 'product',
      name: product.nome,
      category: product.categoria || 'Outro',
      active: true,
      batchYield: 1,
      batchTimeMinutes: Number(product.tempoProducao || 0) * 60,
      expectedMonthlySales: Number(product.quantidadeMes || 0),
      desiredMarginBps: null,
      components: [{
        id: `legacy-component-${sourceId}`,
        ingredientId,
        quantity: 1,
        unit: 'un',
        wasteBps: 0,
      }],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  const fixed = legacyData?.custosFixos ?? {};
  for (const key of ['aluguel', 'energia', 'internet', 'salarios', 'outros']) {
    workspace.fixedCosts[key] = money(fixed[key]);
  }
  workspace.fixedCosts.extras = (fixed.extras ?? []).map((extra, index) => ({
    id: String(extra.id ?? `legacy-extra-${index}`),
    name: extra.nome || extra.descricao || 'Extra',
    valueCents: money(extra.valor),
  }));

  const settings = legacyData?.configuracoes ?? {};
  workspace.settings = {
    businessName: settings.nomeNegocio || '',
    logo: settings.logoNegocio || '',
    region: settings.regiaoAtuacao || '',
    laborHourCents: money(settings.custoHora),
    defaultMarginBps: markupBpsToMarginBps(percentToBps(Number(settings.margemLucro || 0))),
    selectedSalesChannelId: 'channel-direct',
  };
  return workspace;
}
