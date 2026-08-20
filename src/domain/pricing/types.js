/**
 * @typedef {Object} PricingInput
 * @property {number} variableCost - Custo variável unitário.
 * @property {number} fixedCosts - Custos fixos mensais.
 * @property {number} estimatedSales - Vendas estimadas no mês.
 * @property {number} desiredMarginRate - Margem desejada em decimal (ex.: 0.25).
 * @property {number} taxRate - Impostos em decimal.
 * @property {number} paymentFeeRate - Taxa de pagamento em decimal.
 * @property {number} commissionRate - Comissão em decimal.
 */

/**
 * @typedef {Object} PricingResult
 * @property {number} variableCost
 * @property {number} fixedCostPerUnit
 * @property {number} totalUnitCost
 * @property {number} contributionMarginRate
 * @property {number} recommendedPrice
 * @property {number} breakEvenUnits
 */

export {};
