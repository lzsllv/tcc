function assertFiniteNonNegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} deve ser um número não negativo.`);
  }
}

function parseLocalizedNumber(value, label) {
  if (typeof value === 'number') {
    assertFiniteNonNegative(value, label);
    return value;
  }

  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`${label} deve ser informado.`);
  }

  const normalized = value
    .replace(/R\$/gi, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = Number(normalized);
  assertFiniteNonNegative(parsed, label);
  return parsed;
}

export function parseMoneyToCents(value) {
  const amount = parseLocalizedNumber(value, 'Valor monetário');
  return Math.round((amount + Number.EPSILON) * 100);
}

export function formatCents(cents) {
  assertFiniteNonNegative(cents, 'Centavos');
  if (!Number.isInteger(cents)) {
    throw new TypeError('Centavos deve ser um número inteiro.');
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function percentToBps(value) {
  if (typeof value === 'number' && value < 0) {
    throw new RangeError('Percentual deve estar entre 0 e 100.');
  }
  const percentage = parseLocalizedNumber(value, 'Percentual');
  if (percentage > 100) {
    throw new RangeError('Percentual deve estar entre 0 e 100.');
  }
  return Math.round((percentage + Number.EPSILON) * 100);
}
