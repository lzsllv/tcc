const ACCOUNTS_KEY = 'precifique:accounts:v1';
const SESSION_KEY = 'precifique:session:v1';

function clone(value) {
  return structuredClone(value);
}

export class LocalAccountStore {
  constructor(storage = globalThis.localStorage) {
    if (!storage?.getItem || !storage?.setItem || !storage?.removeItem) {
      throw new TypeError('Armazenamento local compatível deve ser informado.');
    }
    this.storage = storage;
  }

  listAccounts() {
    const serialized = this.storage.getItem(ACCOUNTS_KEY);
    if (serialized === null) return [];
    try {
      const accounts = JSON.parse(serialized);
      if (!Array.isArray(accounts)) throw new Error();
      return clone(accounts);
    } catch {
      throw new Error('Os dados locais das contas estão corrompidos.');
    }
  }

  findByEmail(email) {
    return this.listAccounts().find(account => account.email === email) ?? null;
  }

  findById(id) {
    return this.listAccounts().find(account => account.id === id) ?? null;
  }

  addAccount(account) {
    const accounts = this.listAccounts();
    if (accounts.some(current => current.email === account.email)) {
      throw new Error('Já existe uma conta com este e-mail.');
    }
    this.storage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, clone(account)]));
    return clone(account);
  }

  getSessionAccountId() {
    return this.storage.getItem(SESSION_KEY);
  }

  setSessionAccountId(id) {
    this.storage.setItem(SESSION_KEY, id);
  }

  clearSession() {
    this.storage.removeItem(SESSION_KEY);
  }
}
