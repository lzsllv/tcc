import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalAccountStore } from './localAccountStore.js';
import { LocalAuthService } from './LocalAuthService.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

const passwordPort = {
  create: async password => ({
    salt: 'test-salt',
    passwordHash: Array.from(password, char => char.charCodeAt(0)).join('-'),
    iterations: 1,
    algorithm: 'test',
  }),
  verify: async (password, account) => (
    account.passwordHash === Array.from(password, char => char.charCodeAt(0)).join('-')
  ),
};

test('cadastra, normaliza e restaura uma sessão local', async () => {
  const store = new LocalAccountStore(new MemoryStorage());
  const service = new LocalAuthService(
    store,
    passwordPort,
    () => 'user-1',
    () => '2026-09-23T12:00:00.000Z',
  );

  const result = await service.signUp(' Ana ', ' ANA@EXAMPLE.COM ', 'segredo');

  assert.equal(result.requiresEmailConfirmation, false);
  assert.deepEqual(
    (await service.getSession()).user,
    { id: 'user-1', name: 'Ana', email: 'ana@example.com' },
  );
  assert.equal(JSON.stringify(store.listAccounts()).includes('segredo'), false);
});

test('recusa e-mail duplicado e usa mensagem única para credencial inválida', async () => {
  const service = new LocalAuthService(
    new LocalAccountStore(new MemoryStorage()),
    passwordPort,
    () => 'user-1',
  );
  await service.signUp('Ana', 'ana@example.com', 'segredo');

  await assert.rejects(
    () => service.signUp('Outra', ' ANA@example.com ', 'nova'),
    /Já existe/,
  );
  await assert.rejects(
    () => service.signIn('ausente@example.com', 'x'),
    /E-mail ou senha inválidos/,
  );
  await assert.rejects(
    () => service.signIn('ana@example.com', 'errada'),
    /E-mail ou senha inválidos/,
  );
});

test('notifica login e logout, preservando a conta', async () => {
  const store = new LocalAccountStore(new MemoryStorage());
  const service = new LocalAuthService(store, passwordPort, () => 'user-1');
  const sessions = [];
  service.subscribe(session => sessions.push(session));

  await service.signUp('Ana', 'ana@example.com', 'segredo');
  await service.signOut();
  await service.signIn('ANA@example.com', 'segredo');

  assert.deepEqual(sessions.map(session => session?.user.id ?? null), ['user-1', null, 'user-1']);
  assert.equal(store.listAccounts().length, 1);
});

test('descarta sessão que aponta para conta ausente', async () => {
  const storage = new MemoryStorage();
  const store = new LocalAccountStore(storage);
  store.setSessionAccountId('missing');
  const service = new LocalAuthService(store, passwordPort);

  assert.equal(await service.getSession(), null);
  assert.equal(store.getSessionAccountId(), null);
});
