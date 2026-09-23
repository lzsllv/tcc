import { calculateOfferVariableCost } from '../domain/pricing/offers.js';

const fixedCostKeys = ['aluguel', 'energia', 'internet', 'salarios', 'outros'];

export function fixedCostsFromView(fixedCosts) {
  const cents = value => Math.round(Number(value || 0) * 100);
  return {
    ...Object.fromEntries(fixedCostKeys.map(key => [key, cents(fixedCosts[key])])),
    extras: (fixedCosts.extras ?? [])
      .filter(extra => extra.descricao.trim() || Number(extra.valor || 0) > 0)
      .map(extra => ({
        id: String(extra.id),
        name: extra.descricao.trim(),
        valueCents: cents(extra.valor),
      })),
  };
}

export function workspaceToView(workspace) {
  const ingredientsById = Object.fromEntries(workspace.ingredients.map(item => [item.id, item]));
  const produtos = workspace.offers.filter(offer => offer.active).map(offer => {
    let unitCostCents;
    try {
      unitCostCents = calculateOfferVariableCost(offer, ingredientsById, 0).unitCostCents;
    } catch {
      unitCostCents = 0;
    }
    return {
      id: offer.id,
      nome: offer.name,
      categoria: offer.category,
      custo: unitCostCents / 100,
      tempoProducao: offer.batchTimeMinutes / offer.batchYield / 60,
      quantidadeMes: offer.expectedMonthlySales,
    };
  });

  return {
    produtos,
    custosFixos: {
      ...Object.fromEntries(fixedCostKeys.map(key => [key, (workspace.fixedCosts?.[key] ?? 0) / 100])),
      extras: (workspace.fixedCosts?.extras ?? []).map(extra => ({
        id: extra.id,
        descricao: extra.name,
        valor: extra.valueCents / 100,
      })),
    },
    configuracoes: {
      margemLucro: workspace.settings.defaultMarginBps / 100,
      custoHora: workspace.settings.laborHourCents / 100,
      regiaoAtuacao: workspace.settings.region,
      nomeNegocio: workspace.settings.businessName,
      logoNegocio: workspace.settings.logo,
    },
  };
}
