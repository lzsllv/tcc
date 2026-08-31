const UNITS = Object.freeze({
  mg: { family: 'mass', factor: 0.001 },
  g: { family: 'mass', factor: 1 },
  kg: { family: 'mass', factor: 1000 },
  ml: { family: 'volume', factor: 1 },
  l: { family: 'volume', factor: 1000 },
  un: { family: 'count', factor: 1 },
  min: { family: 'time', factor: 1 },
  h: { family: 'time', factor: 60 },
});

function getUnitDefinition(unit) {
  const definition = UNITS[unit];
  if (!definition) {
    throw new RangeError(`Unidade não suportada: ${unit}.`);
  }
  return definition;
}

export function getUnitFamily(unit) {
  return getUnitDefinition(unit).family;
}

export function convertQuantity(quantity, fromUnit, toUnit) {
  if (!Number.isFinite(quantity) || quantity < 0) {
    throw new RangeError('Quantidade deve ser um número não negativo.');
  }

  const from = getUnitDefinition(fromUnit);
  const to = getUnitDefinition(toUnit);
  if (from.family !== to.family) {
    throw new RangeError(`Não é possível converter ${fromUnit} para ${toUnit}.`);
  }

  return (quantity * from.factor) / to.factor;
}
