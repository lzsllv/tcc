import type { RequestHandler } from 'express';
import type { AuthVerifier } from '../../auth/auth-verifier.js';
export declare function authenticate(verifier: AuthVerifier): RequestHandler;
