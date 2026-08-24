function parseKey(storage, key, fallback) {
  const serialized = storage.getItem(key);
  return serialized === null ? fallback : JSON.parse(serialized);
}

export function readLegacyData(storage = globalThis.localStorage) {
  if (!storage?.getItem) {
    throw new TypeError('Armazenamento local compatível deve ser informado.');
  }
  return {
    produtos: parseKey(storage, 'produtos', []),
    custosFixos: parseKey(storage, 'custosFixos', {}),
    configuracoes: parseKey(storage, 'configuracoes', {}),
  };
}
