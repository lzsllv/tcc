function authFailure(error, fallback) {
  const message = String(error?.message ?? '').toLowerCase();
  if (message.includes('invalid login credentials')) return new Error('E-mail ou senha inválidos.');
  if (message.includes('already registered') || message.includes('already been registered')) return new Error('Este e-mail já está cadastrado.');
  return new Error(fallback);
}

export class SupabaseAuthService {
  constructor(client) {
    if (!client?.auth) throw new TypeError('Cliente Supabase Auth deve ser informado.');
    this.client = client;
  }

  async getSession() {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw authFailure(error, 'Não foi possível restaurar a sessão.');
    return data.session;
  }

  async getAccessToken() {
    return (await this.getSession())?.access_token ?? null;
  }

  async signIn(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) throw authFailure(error, 'Não foi possível entrar na conta.');
    return data;
  }

  async signUp(name, email, password) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error || !data.user) throw authFailure(error, 'Não foi possível criar a conta.');
    return { ...data, requiresEmailConfirmation: !data.session };
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw authFailure(error, 'Não foi possível sair da conta.');
  }

  subscribe(callback) {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => callback(session));
    return () => data.subscription.unsubscribe();
  }
}
