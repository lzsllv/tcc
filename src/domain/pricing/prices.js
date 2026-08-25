function assertMoney(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${label} deve ser um inteiro não negativo em centavos.`);
  }
}

function assertBps(value, label) {
  if (!Number.isInteger(value) || value < 0 || value > 10000) {
    throw new RangeError(`${label} deve estar entre 0 e 10000 pontos-base.`);
  }
}

export function calculatePriceReferences(input) {
  const {
    variableCostCents,
    fixedAllocationCents,
    percentageFeesBps,
    fixedFeesCents,
    desiredMarginBps,
  } = input;

  assertMoney(variableCostCents, 'Custo variável');
  assertMoney(fixedAllocationCents, 'Rateio fixo');
  assertMoney(fixedFeesCents, 'Taxas fixas');
  assertBps(percentageFeesBps, 'Taxas percentuais');
  assertBps(desiredMarginBps, 'Margem desejada');

  const feeRate = percentageFeesBps / 10000;
  const marginRate = desiredMarginBps / 10000;
  const feeDenominator = 1 - feeRate;
  const recommendedDenominator = 1 - feeRate - marginRate;
  if (feeDenominator <= 0 || recommendedDenominator <= 0) {
    throw new RangeError('A soma de taxas e margem deve ser menor que 100%.');
  }

  return {
    minimumPriceCents: Math.round((variableCostCents + fixedFeesCents) / feeDenominator),
    sustainablePriceCents: Math.round(
      (variableCostCents + fixedAllocationCents + fixedFeesCents) / feeDenominator,
    ),
    recommendedPriceCents: Math.round(
      (variableCostCents + fixedAllocationCents + fixedFeesCents) / recommendedDenominator,
    ),
  };
}
