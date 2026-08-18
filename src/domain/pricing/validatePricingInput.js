export function validatePricingInput(input) {
  const requiredNumbers = [
    'variableCost',
    'fixedCosts',
    'estimatedSales',
    'desiredMarginRate',
    'taxRate',
    'paymentFeeRate',
    'commissionRate',
  ];

  for (const field of requiredNumbers) {
    if (typeof input[field] !== 'number' || !Number.isFinite(input[field])) {
      throw new Error(`O campo ${field} deve ser um número válido.`);
    }
  }

  if (input.variableCost < 0) {
    throw new Error('O custo variável não pode ser negativo.');
  }

  if (input.fixedCosts < 0) {
    throw new Error('Os custos fixos não podem ser negativos.');
  }

  if (input.estimatedSales <= 0) {
    throw new Error('As vendas estimadas devem ser maiores que zero.');
  }

  const rates = [
    ['desiredMarginRate', input.desiredMarginRate],
    ['taxRate', input.taxRate],
    ['paymentFeeRate', input.paymentFeeRate],
    ['commissionRate', input.commissionRate],
  ];

  for (const [name, value] of rates) {
    if (value < 0 || value >= 1) {
      throw new Error(`${name} deve estar entre 0 e 1.`);
    }
  }

  const divisor =
    1 -
    input.desiredMarginRate -
    input.taxRate -
    input.paymentFeeRate -
    input.commissionRate;

  if (divisor <= 0) {
    throw new Error('A margem e as taxas configuradas não permitem calcular um preço válido.');
  }
}
