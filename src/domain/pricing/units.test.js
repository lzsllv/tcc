import test from 'node:test';
import assert from 'node:assert/strict';
import { convertQuantity, getUnitFamily } from './units.js';

test('identifica a família de cada unidade suportada', () => {
  assert.equal(getUnitFamily('kg'), 'mass');
  assert.equal(getUnitFamily('ml'), 'volume');
  assert.equal(getUnitFamily('h'), 'time');
  assert.equal(getUnitFamily('un'), 'count');
});

test('converte massa pela unidade-base', () => {
  assert.equal(convertQuantity(1, 'kg', 'g'), 1000);
  assert.equal(convertQuantity(250, 'g', 'kg'), 0.25);
});

test('converte volume e tempo pela unidade-base', () => {
  assert.equal(convertQuantity(750, 'ml', 'l'), 0.75);
  assert.equal(convertQuantity(2, 'h', 'min'), 120);
});

test('preserva quantidades por contagem', () => {
  assert.equal(convertQuantity(3, 'un', 'un'), 3);
});

test('rejeita conversão entre famílias incompatíveis', () => {
  assert.throws(() => convertQuantity(1, 'kg', 'l'), RangeError);
});

test('rejeita unidade desconhecida e quantidade negativa', () => {
  assert.throws(() => getUnitFamily('cx'), RangeError);
  assert.throws(() => convertQuantity(-1, 'g', 'kg'), RangeError);
});
