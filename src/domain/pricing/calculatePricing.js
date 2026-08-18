import { validatePricingInput } from './validatePricingInput';

export function calculatePricing(input) {
  validatePricingInput(input);

  const fixedCostPerUnit = input.fixedCosts / input.estimatedSales;
  const totalUnitCost = input.variableCost + fixedCostPerUnit;
  const divisor =
    1 -
    input.desiredMarginRate -
    input.taxRate -
    input.paymentFeeRate -
    input.commissionRate;
  const recommendedPrice = totalUnitCost / divisor;
  const contributionMarginRate =
    (recommendedPrice - input.variableCost) / recommendedPrice;
  const breakEvenUnits = Math.ceil(
    input.fixedCosts /
      (recommendedPrice * (1 - input.taxRate - input.paymentFeeRate - input.commissionRate) - input.variableCost),
  );

  return {
    variableCost: input.variableCost,
    fixedCostPerUnit,
    totalUnitCost,
    contributionMarginRate,
    recommendedPrice,
    breakEvenUnits,
  };
}
