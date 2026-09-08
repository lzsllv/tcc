import type { AuthVerifier } from './auth-verifier.js';
interface ClaimsClient {
    auth: {
        getClaims(jwt: string): Promise<{
            data: {
                claims?: {
                    sub?: string;
                };
            } | null;
            error: unknown;
        }>;
    };
}
export declare class SupabaseAuthVerifier implements AuthVerifier {
    private readonly client;
    constructor(client: ClaimsClient);
    verify(accessToken: string): Promise<string>;
}
export declare function createSupabaseAuthVerifier(url: string, publishableKey: string): SupabaseAuthVerifier;
export {};
