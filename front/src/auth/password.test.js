import test from 'node:test';
import assert from 'node:assert/strict';
import { createPasswordRecord, verifyPassword } from './password.js';

test('deriva credencial sem persistir a senha e usa salt exclusivo', async () => {
  const first = await createPasswordRecord('segredo-local');
  const second = await createPasswordRecord('segredo-local');

  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.passwordHash, 'segredo-local');
  assert.equal(await verifyPassword('segredo-local', first), true);
  assert.equal(await verifyPassword('senha-errada', first), false);
});

test('recusa senha vazia e ambiente sem Web Crypto', async () => {
  await assert.rejects(() => createPasswordRecord(''), /senha/i);
  await assert.rejects(
    () => createPasswordRecord('segredo-local', {}),
    /Web Crypto/i,
  );
});
