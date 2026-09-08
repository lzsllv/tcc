import type { WorkspaceApplicationService } from '../../application/workspace-service.js';
import type { UploadedLogo } from '../../application/logo-service.js';
import type { WorkspaceRecord } from '../../application/workspace-repository.js';
export declare function workspaceRoutes(service: WorkspaceApplicationService): import("express-serve-static-core").Router;
export interface LogoHttpService {
    upload(ownerId: string, file: UploadedLogo, expectedRevision: number): Promise<WorkspaceRecord>;
    remove(ownerId: string, expectedRevision: number): Promise<WorkspaceRecord>;
}
export declare function logoRoutes(service: LogoHttpService): import("express-serve-static-core").Router;
