import {
  calculateFixedCostAllocation,
  calculateOfferVariableCost,
  calculatePriceReferences,
} from '../domain/pricing/index.js';

function findActiveOffer(workspace, offerId) {
  const offer = workspace?.offers?.find(item => item.id === offerId);
  if (!offer) throw new ReferenceError('Oferta não encontrada para precificação.');
  if (!offer.active) throw new RangeError('Somente uma oferta ativa pode ser precificada.');
  return offer;
}

function findActiveChannel(workspace, channelId) {
  const channel = workspace?.salesChannels?.find(item => item.id === channelId);
  if (!channel) throw new ReferenceError('Canal de venda não encontrado para precificação.');
  if (!channel.active) throw new RangeError('Somente um canal ativo pode ser usado na precificação.');
  return channel;
}

function totalFixedCosts(fixedCosts) {
  const base = ['aluguel', 'energia', 'internet', 'salarios', 'outros']
    .reduce((total, key) => {
      const value = fixedCosts?.[key] ?? 0;
      if (!Number.isInteger(value) || value < 0) throw new RangeError('Custos fixos devem ser inteiros não negativos em centavos.');
      return total + value;
    }, 0);
  return base + (fixedCosts?.extras ?? []).reduce((total, extra) => {
    const value = extra.valueCents ?? 0;
    if (!Number.isInteger(value) || value < 0) throw new RangeError('Custos fixos extras devem ser inteiros não negativos em centavos.');
    return total + value;
  }, 0);
}

function summarizeFees(fees) {
  return (fees ?? []).reduce((summary, fee) => {
    if (!Number.isInteger(fee.value) || fee.value < 0) throw new RangeError('Taxa do canal deve ser um inteiro não negativo.');
    if (fee.kind === 'percentage') summary.percentageFeesBps += fee.value;
    else if (fee.kind === 'fixed') summary.fixedFeesCents += fee.value;
    else throw new RangeError('Natureza da taxa do canal inválida.');
    return summary;
  }, { percentageFeesBps: 0, fixedFeesCents: 0 });
}

export function priceOfferForChannel(workspace, offerId, channelId) {
  const offer = findActiveOffer(workspace, offerId);
  const channel = findActiveChannel(workspace, channelId);
  const ingredientsById = Object.fromEntries((workspace.ingredients ?? []).map(item => [item.id, item]));
  const costs = calculateOfferVariableCost(offer, ingredientsById, workspace.settings.laborHourCents);
  const activeOffers = workspace.offers.filter(item => item.active);
  const fixedAllocationCents = calculateFixedCostAllocation(totalFixedCosts(workspace.fixedCosts), activeOffers);
  const marginBps = offer.desiredMarginBps ?? workspace.settings.defaultMarginBps;
  const fees = summarizeFees(channel.fees);
  const input = {
    variableCostCents: costs.unitCostCents,
    fixedAllocationCents: fixedAllocationCents ?? 0,
    percentageFeesBps: fees.percentageFeesBps,
    fixedFeesCents: fees.fixedFeesCents,
  };
  const basePrices = calculatePriceReferences({ ...input, desiredMarginBps: 0 });
  let recommendedPriceCents = null;
  let pricingError = null;
  try {
    recommendedPriceCents = calculatePriceReferences({ ...input, desiredMarginBps: marginBps }).recommendedPriceCents;
  } catch (error) {
    if (!(error instanceof RangeError) || !/taxas e margem/i.test(error.message)) throw error;
    pricingError = error.message;
  }
  const prices = {
    minimumPriceCents: basePrices.minimumPriceCents,
    sustainablePriceCents: fixedAllocationCents === null ? null : basePrices.sustainablePriceCents,
    recommendedPriceCents: fixedAllocationCents === null ? null : recommendedPriceCents,
  };
  return { costs, fixedAllocationCents, marginBps, fees, prices, pricingError };
}
