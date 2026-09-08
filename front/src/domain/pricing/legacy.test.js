import test from 'node:test';
import assert from 'node:assert/strict';
import { markupBpsToMarginBps } from './legacy.js';

test('converte markup legado em margem equivalente', () => {
  assert.equal(markupBpsToMarginBps(2000), 1667);
  assert.equal(markupBpsToMarginBps(10000), 5000);
  assert.equal(markupBpsToMarginBps(0), 0);
});

test('rejeita markup negativo', () => {
  assert.throws(() => markupBpsToMarginBps(-1), RangeError);
});
