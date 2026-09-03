function assertMoney(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${label} deve ser um inteiro não negativo em centavos.`);
  }
}

export function calculateUnitContribution({
  priceCents,
  percentageFeesBps,
  fixedFeesCents,
  variableCostCents,
}) {
  assertMoney(priceCents, 'Preço');
  assertMoney(fixedFeesCents, 'Taxas fixas');
  assertMoney(variableCostCents, 'Custo variável');
  if (!Number.isInteger(percentageFeesBps) || percentageFeesBps < 0 || percentageFeesBps > 10000) {
    throw new RangeError('Taxas percentuais devem estar entre 0 e 10000 pontos-base.');
  }

  return Math.round(
    priceCents * (1 - percentageFeesBps / 10000) - fixedFeesCents - variableCostCents,
  );
}

export function calculateOfferBreakEven({ totalFixedCostsCents, unitContributionCents }) {
  assertMoney(totalFixedCostsCents, 'Custos fixos');
  if (!Number.isInteger(unitContributionCents)) {
    throw new TypeError('Contribuição unitária deve ser um inteiro em centavos.');
  }
  return unitContributionCents > 0
    ? Math.ceil(totalFixedCostsCents / unitContributionCents)
    : null;
}

export function calculateWeightedBreakEven({ totalFixedCostsCents, offers }) {
  assertMoney(totalFixedCostsCents, 'Custos fixos');
  let totalUnits = 0;
  let totalContribution = 0;

  for (const offer of offers ?? []) {
    const quantity = offer.expectedMonthlySales ?? 0;
    if (!Number.isFinite(quantity) || quantity < 0) {
      throw new RangeError('Quantidade mensal deve ser um número não negativo.');
    }
    if (!Number.isInteger(offer.unitContributionCents)) {
      throw new TypeError('Contribuição unitária deve ser um inteiro em centavos.');
    }
    if (quantity > 0) {
      totalUnits += quantity;
      totalContribution += offer.unitContributionCents * quantity;
    }
  }

  if (totalUnits === 0) return null;
  const weightedContribution = totalContribution / totalUnits;
  return weightedContribution > 0
    ? Math.ceil(totalFixedCostsCents / weightedContribution)
    : null;
}
