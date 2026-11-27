import { calculatePriceReferences } from '../../pricing/domain/prices.js';

const fixedCostKeys = ['aluguel', 'energia', 'internet', 'salarios', 'outros'];

function getFixedCostsCents(fixedCosts = {}) {
  const baseCents = fixedCostKeys.reduce(
    (total, key) => total + Math.round(Number(fixedCosts[key] || 0) * 100),
    0,
  );
  const extraCents = (Array.isArray(fixedCosts.extras) ? fixedCosts.extras : [])
    .reduce((total, item) => total + Math.round(Number(item.valor || 0) * 100), 0);
  return baseCents + extraCents;
}

function getChannelFees(workspace) {
  const channels = (workspace?.salesChannels ?? []).filter(channel => channel.active);
  const selectedChannel = channels.find(channel => channel.id === workspace?.settings?.selectedSalesChannelId)
    ?? channels.find(channel => channel.isDefault)
    ?? channels[0];
  return (selectedChannel?.fees ?? []).reduce((total, fee) => {
    if (fee.kind === 'percentage') total.percentageFeesBps += fee.value;
    if (fee.kind === 'fixed') total.fixedFeesCents += fee.value;
    return total;
  }, { percentageFeesBps: 0, fixedFeesCents: 0 });
}

export function calculateServerProductSimulation({
  product,
  settings = {},
  fixedCosts,
  workspace,
  monthlyQuantity,
  salePrice,
}) {
  const quantity = Number(monthlyQuantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { suggestedPrice: null, totalCost: null };
  }

  const directCostCents = Math.round(Number(product.custo_direto || 0) * 100);
  const hourlyLaborCostCents = Math.round(
    Number(settings.custoHora || 0) * Number(product.tempo_producao || 0) * 100,
  );
  const variableCostCents = directCostCents + hourlyLaborCostCents;
  const fixedAllocationCents = Math.round(getFixedCostsCents(fixedCosts) / quantity);
  const fees = getChannelFees(workspace);
  const marginBps = Math.round(Number(settings.margemLucro || 0) * 100);

  let suggestedPrice = null;
  try {
    suggestedPrice = calculatePriceReferences({
      variableCostCents,
      fixedAllocationCents,
      percentageFeesBps: fees.percentageFeesBps,
      fixedFeesCents: fees.fixedFeesCents,
      desiredMarginBps: marginBps,
    }).recommendedPriceCents / 100;
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
  }

  const price = Number(salePrice);
  const totalCost = Number.isFinite(price) && price >= 0
    ? (variableCostCents + fixedAllocationCents + fees.fixedFeesCents) / 100
      + price * fees.percentageFeesBps / 10000
    : null;

  return { suggestedPrice, totalCost };
}
