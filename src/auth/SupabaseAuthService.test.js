import test from 'node:test';
import assert from 'node:assert/strict';
import { SupabaseAuthService } from './SupabaseAuthService.js';

test('cadastro informa quando a confirmação de e-mail está pendente', async () => {
  const service = new SupabaseAuthService({ auth: {
    signUp: async () => ({ data: { user: { id: 'user-1', email: 'ana@example.com' }, session: null }, error: null }),
  } });

  const result = await service.signUp('Ana', 'ana@example.com', 'senha-segura');

  assert.equal(result.requiresEmailConfirmation, true);
  assert.equal(result.user.id, 'user-1');
});

test('login propaga uma mensagem segura do Supabase', async () => {
  const service = new SupabaseAuthService({ auth: {
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Invalid login credentials' } }),
  } });

  await assert.rejects(() => service.signIn('ana@example.com', 'errada'), /E-mail ou senha inválidos/);
});
