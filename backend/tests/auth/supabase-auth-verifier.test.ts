import { describe, expect, it } from 'vitest';
import { SupabaseAuthVerifier } from '../../src/auth/supabase-auth-verifier.js';

describe('SupabaseAuthVerifier', () => {
  it('retorna somente o subject validado pelo Supabase', async () => {
    const verifier = new SupabaseAuthVerifier({
      auth: { getClaims: async () => ({ data: { claims: { sub: 'user-123' } }, error: null }) },
    });

    await expect(verifier.verify('access-token')).resolves.toBe('user-123');
  });

  it('recusa token inválido ou sem subject', async () => {
    const invalid = new SupabaseAuthVerifier({
      auth: { getClaims: async () => ({ data: null, error: new Error('invalid') }) },
    });
    const missingSubject = new SupabaseAuthVerifier({
      auth: { getClaims: async () => ({ data: { claims: {} }, error: null }) },
    });

    await expect(invalid.verify('bad')).rejects.toThrow(/token/i);
    await expect(missingSubject.verify('bad')).rejects.toThrow(/token/i);
  });
});
