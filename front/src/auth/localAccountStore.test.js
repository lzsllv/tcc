import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalAccountStore } from './localAccountStore.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

const account = {
  id: 'user-1',
  name: 'Ana',
  email: 'ana@example.com',
  salt: 'salt',
  passwordHash: 'hash',
  iterations: 1,
  algorithm: 'PBKDF2-SHA-256',
};

test('persiste contas e sessão ativa', () => {
  const store = new LocalAccountStore(new MemoryStorage());
  store.addAccount(account);
  store.setSessionAccountId(account.id);

  assert.deepEqual(store.findByEmail('ana@example.com'), account);
  assert.equal(store.getSessionAccountId(), 'user-1');
  store.clearSession();
  assert.equal(store.getSessionAccountId(), null);
});

test('não sobrescreve conta duplicada', () => {
  const store = new LocalAccountStore(new MemoryStorage());
  store.addAccount(account);

  assert.throws(() => store.addAccount({ ...account, id: 'user-2' }), /e-mail/i);
});

test('propaga armazenamento corrompido e falha de quota', () => {
  const storage = new MemoryStorage();
  storage.setItem('precifique:accounts:v1', '{');
  const store = new LocalAccountStore(storage);

  assert.throws(() => store.listAccounts(), /dados locais/i);
  storage.setItem('precifique:accounts:v1', '[]');
  storage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => store.addAccount(account), /quota/);
});
