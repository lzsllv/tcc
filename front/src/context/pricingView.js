export function createPricingView(products, fixedCosts, settings) {
  function totalFixedCosts() {
    const base = Object.entries(fixedCosts)
      .filter(([key]) => key !== 'extras')
      .reduce((total, [, value]) => total + Number(value), 0);
    const extras = (fixedCosts.extras || [])
      .reduce((total, extra) => total + Number(extra.valor || 0), 0);
    return base + extras;
  }

  function totalMonthlyUnits() {
    if (!products.length) return 1;
    const total = products.reduce((sum, product) => sum + (Number(product.quantidadeMes) || 0), 0);
    return total > 0 ? total : 1;
  }

  const fixedCostPerUnit = () => totalFixedCosts() / totalMonthlyUnits();
  const fixedCostPerProduct = () => products.length ? totalFixedCosts() / products.length : 0;
  const totalProductCost = product => Number(product.custo || 0)
    + fixedCostPerUnit()
    + Number(settings.custoHora) * Number(product.tempoProducao || 0);

  function suggestedPrice(product) {
    const margin = Number(settings.margemLucro) / 100;
    return margin >= 1 ? 0 : totalProductCost(product) / (1 - margin);
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
