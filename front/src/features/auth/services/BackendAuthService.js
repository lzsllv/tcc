import api from '../../../services/api.js';

const SESSION_KEY = 'precifique:backend-session:v1';

function responseData(response, fallbackMessage) {
  const payload = response.data;
  if (payload?.sucesso !== true) {
    throw new Error(payload?.mensagem || fallbackMessage);
  }
  return payload.dados;
}

function backendError(error, fallbackMessage) {
  return new Error(error.response?.data?.mensagem || error.message || fallbackMessage);
}

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

export class BackendAuthService {
  constructor(storage = globalThis.localStorage) {
    if (!storage?.getItem || !storage?.setItem || !storage?.removeItem) {
      throw new TypeError('Armazenamento local compatível deve ser informado.');
    }
    this.storage = storage;
    this.listeners = new Set();
  }

  async getSession() {
    const serialized = this.storage.getItem(SESSION_KEY);
    if (serialized === null) return null;

    const session = JSON.parse(serialized);
    if (!session?.user?.id) {
      throw new Error('A sessão salva do servidor é inválida. Entre novamente.');
    }
    return session;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(session) {
    for (const listener of this.listeners) listener(session);
  }

  async signIn(email, password) {
    try {
      const response = await api.post('/login', {
        email_usuario: normalizeEmail(email),
        senha_usuario: password,
      });
      const user = responseData(response, 'Não foi possível entrar.');
      if (!user?.id_usuario) {
        throw new Error('O servidor não retornou os dados da conta.');
      }

      const session = {
        user: {
          id: user.id_usuario,
          name: user.nome_usuario,
          email: user.email_usuario,
        },
      };
      this.storage.setItem(SESSION_KEY, JSON.stringify(session));
      this.emit(session);
      return { user: session.user, session };
    } catch (error) {
      throw backendError(error, 'Não foi possível entrar.');
    }
  }

  async signUp(name, email, password) {
    try {
      const response = await api.post('/usuarios', {
        nome_usuario: String(name ?? '').trim(),
        email_usuario: normalizeEmail(email),
        senha_usuario: password,
      });
      responseData(response, 'Não foi possível criar a conta.');
    } catch (error) {
      throw backendError(error, 'Não foi possível criar a conta.');
    }

    try {
      const result = await this.signIn(email, password);
      return { ...result, requiresEmailConfirmation: false };
    } catch (error) {
      throw new Error(`Conta criada, mas não foi possível iniciar a sessão: ${error.message}`, { cause: error });
    }
  }

  async signOut() {
    this.storage.removeItem(SESSION_KEY);
    this.emit(null);
  }
}
