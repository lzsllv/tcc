export function createReportProjection(products, totalFixedCosts, totalMonthlyUnits, fixedCostPerUnit, totalProductCost, suggestedPrice) {
  const totalCosts = totalFixedCosts();
  const totalUnits = totalMonthlyUnits();
  const unitFixedCost = fixedCostPerUnit();
  const totalRevenue = products.reduce((total, product) => total + suggestedPrice(product) * Number(product.quantidadeMes || 0), 0);
  const totalProfit = products.reduce((total, product) => {
    const unitProfit = suggestedPrice(product) - totalProductCost(product);
    return total + unitProfit * Number(product.quantidadeMes || 0);
  }, 0);
  return { totalCosts, totalUnits, fixedCostPerUnit: unitFixedCost, zeroCosts: totalCosts === 0, totalRevenue, totalProfit };
}
