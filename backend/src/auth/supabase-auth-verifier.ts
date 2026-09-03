import { createClient } from '@supabase/supabase-js';
import type { AuthVerifier } from './auth-verifier.js';

interface ClaimsClient {
  auth: {
    getClaims(jwt: string): Promise<{
      data: { claims?: { sub?: string } } | null;
      error: unknown;
    }>;
  };
}

export class SupabaseAuthVerifier implements AuthVerifier {
  constructor(private readonly client: ClaimsClient) {}

  async verify(accessToken: string): Promise<string> {
    const { data, error } = await this.client.auth.getClaims(accessToken);
    const subject = data?.claims?.sub;
    if (error || typeof subject !== 'string' || !subject) {
      throw new Error('Token Supabase inválido.');
    }
    return subject;
  }
}

export function createSupabaseAuthVerifier(url: string, publishableKey: string) {
  const client = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return new SupabaseAuthVerifier(client);
}
