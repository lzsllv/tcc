export function calculateFixedCostAllocation(totalFixedCostsCents, offers) {
  if (!Number.isInteger(totalFixedCostsCents) || totalFixedCostsCents < 0) {
    throw new RangeError('Custos fixos devem ser um inteiro não negativo em centavos.');
  }

  const totalPlannedUnits = (offers ?? []).reduce((total, offer) => {
    const quantity = offer.expectedMonthlySales ?? 0;
    if (!Number.isFinite(quantity) || quantity < 0) {
      throw new RangeError('Quantidade mensal deve ser um número não negativo.');
    }
    return total + quantity;
  }, 0);

  return totalPlannedUnits > 0
    ? Math.round(totalFixedCostsCents / totalPlannedUnits)
    : null;
}
