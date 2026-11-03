import { priceOfferForChannel } from '../features/offers/services/offerPricing.js';

export function createPricingView(products, fixedCosts, settings, workspace) {
  function offerPricing(product) {
    if (!workspace) return null;
    const channels = workspace.salesChannels.filter(channel => channel.active);
    const channel = channels.find(item => item.id === workspace.settings.selectedSalesChannelId)
      ?? channels.find(item => item.isDefault) ?? channels[0];
    if (!channel) return null;
    try { return priceOfferForChannel(workspace, product.id, channel.id); }
    catch { return null; }
  }
  function totalFixedCosts() {
    const base = Object.entries(fixedCosts)
      .filter(([key]) => key !== 'extras')
      .reduce((total, [, value]) => total + Number(value), 0);
    const extras = (fixedCosts.extras || [])
      .reduce((total, extra) => total + Number(extra.valor || 0), 0);
    return base + extras;
  }

  function totalMonthlyUnits() {
    const total = products.reduce((sum, product) => sum + (Number(product.quantidadeMes) || 0), 0);
    return total;
  }

  const fixedCostPerUnit = () => totalMonthlyUnits() > 0
    ? Math.round(totalFixedCosts() * 100 / totalMonthlyUnits()) / 100 : null;
  const fixedCostPerProduct = () => products.length ? totalFixedCosts() / products.length : 0;
  function totalProductCost(product, salePrice) {
    if (workspace) {
      const pricing = offerPricing(product);
      if (!pricing || pricing.fixedAllocationCents === null) return null;
      const price = salePrice ?? (pricing.prices.recommendedPriceCents === null
        ? null : pricing.prices.recommendedPriceCents / 100);
      if (price === null) return null;
      return (pricing.costs.unitCostCents + pricing.fixedAllocationCents
        + pricing.fees.fixedFeesCents) / 100 + Number(price) * pricing.fees.percentageFeesBps / 10000;
    }
    if (fixedCostPerUnit() === null) return null;
    return Number(product.custo || 0) + fixedCostPerUnit()
      + Number(settings.custoHora) * Number(product.tempoProducao || 0);
  }

  function suggestedPrice(product) {
    if (workspace) {
      const cents = offerPricing(product)?.prices.recommendedPriceCents;
      return cents == null ? null : cents / 100;
    }
    const margin = Number(settings.margemLucro) / 100;
    const cost = totalProductCost(product);
    return margin >= 1 || cost === null ? null : cost / (1 - margin);
  }

  const monthlyProfit = (salePrice, totalCost, quantity) => (
    (Number(salePrice) - Number(totalCost)) * Number(quantity)
  );

  return {
    totalFixedCosts,
    totalMonthlyUnits,
    fixedCostPerUnit,
    fixedCostPerProduct,
    totalProductCost,
    suggestedPrice,
    monthlyProfit,
  };
}
