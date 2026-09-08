import { createClient } from '@supabase/supabase-js';
export class SupabaseAuthVerifier {
    client;
    constructor(client) {
        this.client = client;
    }
    async verify(accessToken) {
        const { data, error } = await this.client.auth.getClaims(accessToken);
        const subject = data?.claims?.sub;
        if (error || typeof subject !== 'string' || !subject) {
            throw new Error('Token Supabase inválido.');
        }
        return subject;
    }
}
export function createSupabaseAuthVerifier(url, publishableKey) {
    const client = createClient(url, publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return new SupabaseAuthVerifier(client);
}
//# sourceMappingURL=supabase-auth-verifier.js.map