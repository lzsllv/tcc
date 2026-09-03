export interface AuthVerifier {
  verify(accessToken: string): Promise<string>;
}
