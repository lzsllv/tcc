import type { WorkspaceApplicationService } from './application/workspace-service.js';
import type { AuthVerifier } from './auth/auth-verifier.js';
import { type LogoHttpService } from './http/routes/workspace-routes.js';
interface AppOptions {
    corsOrigin?: string;
    workspaceService?: WorkspaceApplicationService;
    authVerifier?: AuthVerifier;
    logoService?: LogoHttpService;
    logLevel?: string;
}
export declare function createApp(options?: AppOptions): import("express-serve-static-core").Express;
export {};
