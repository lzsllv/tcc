import { createPasswordRecord, verifyPassword } from './password.js';

const defaultPasswordPort = {
  create: createPasswordRecord,
  verify: verifyPassword,
};

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

function session(account) {
  return {
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
    },
  };
}

export class LocalAuthService {
  constructor(
    store,
    passwordPort = defaultPasswordPort,
    createId = () => globalThis.crypto.randomUUID(),
    now = () => new Date().toISOString(),
  ) {
    this.store = store;
    this.passwordPort = passwordPort;
    this.createId = createId;
    this.now = now;
    this.listeners = new Set();
  }

  async getSession() {
    const id = this.store.getSessionAccountId();
    if (!id) return null;
    const account = this.store.findById(id);
    if (!account) {
      this.store.clearSession();
      return null;
    }
    return session(account);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(value) {
    for (const listener of this.listeners) listener(value);
  }

  async signUp(name, email, password) {
    const normalizedName = String(name ?? '').trim();
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedName || !normalizedEmail || !password) {
      throw new Error('Preencha todos os campos.');
    }
    if (this.store.findByEmail(normalizedEmail)) {
      throw new Error('Já existe uma conta com este e-mail.');
    }
    const credential = await this.passwordPort.create(password);
    const account = this.store.addAccount({
      id: this.createId(),
      name: normalizedName,
      email: normalizedEmail,
      ...credential,
      createdAt: this.now(),
    });
    this.store.setSessionAccountId(account.id);
    const current = session(account);
    this.emit(current);
    return { user: current.user, session: current, requiresEmailConfirmation: false };
  }

  async signIn(email, password) {
    const account = this.store.findByEmail(normalizeEmail(email));
    if (!account || !await this.passwordPort.verify(password, account)) {
      throw new Error('E-mail ou senha inválidos.');
    }
    this.store.setSessionAccountId(account.id);
    const current = session(account);
    this.emit(current);
    return { user: current.user, session: current };
  }

  async signOut() {
    this.store.clearSession();
    this.emit(null);
  }
}
