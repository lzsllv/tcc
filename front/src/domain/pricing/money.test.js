import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCents, parseMoneyToCents, percentToBps } from './money.js';

test('converte valor monetário brasileiro para centavos', () => {
  assert.equal(parseMoneyToCents('12,34'), 1234);
  assert.equal(parseMoneyToCents('R$ 1.234,56'), 123456);
  assert.equal(parseMoneyToCents(12.34), 1234);
});

test('arredonda frações monetárias no limite público', () => {
  assert.equal(parseMoneyToCents(10.005), 1001);
});

test('rejeita valores monetários ausentes, negativos ou inválidos', () => {
  for (const value of ['', null, undefined, -1, 'abc']) {
    assert.throws(() => parseMoneyToCents(value), { name: 'TypeError' });
  }
});

test('formata centavos como moeda brasileira', () => {
  assert.equal(formatCents(1234), 'R$ 12,34');
});

test('converte percentual para pontos-base', () => {
  assert.equal(percentToBps('16,67'), 1667);
  assert.equal(percentToBps(100), 10000);
});

test('rejeita percentual negativo ou acima de cem', () => {
  assert.throws(() => percentToBps(-1), RangeError);
  assert.throws(() => percentToBps(100.01), RangeError);
});
