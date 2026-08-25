import test from 'node:test';
import assert from 'node:assert/strict';
import { readLegacyData } from './legacyStorage.js';

class MemoryStorage {
  constructor(entries = {}) { this.data = new Map(Object.entries(entries)); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
}

test('lê as três chaves legadas sem modificá-las', () => {
  const storage = new MemoryStorage({
    produtos: JSON.stringify([{ id: 1 }]),
    custosFixos: JSON.stringify({ aluguel: 10 }),
    configuracoes: JSON.stringify({ margemLucro: 20 }),
  });
  assert.deepEqual(readLegacyData(storage), {
    produtos: [{ id: 1 }],
    custosFixos: { aluguel: 10 },
    configuracoes: { margemLucro: 20 },
  });
  assert.equal(storage.data.size, 3);
});

test('usa estruturas vazias quando as chaves antigas não existem', () => {
  assert.deepEqual(readLegacyData(new MemoryStorage()), {
    produtos: [],
    custosFixos: {},
    configuracoes: {},
  });
});

test('propaga JSON legado inválido para impedir sobrescrita silenciosa', () => {
  assert.throws(() => readLegacyData(new MemoryStorage({ produtos: '{' })), SyntaxError);
});
