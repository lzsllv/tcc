import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Workspace, WorkspaceRecord, WorkspaceRepository } from '../../application/workspace-repository.js';
export declare class PrismaWorkspaceRepository implements WorkspaceRepository {
    private readonly prisma;
    constructor(client: PrismaClient | unknown);
    load(ownerId: string): Promise<WorkspaceRecord | null>;
    bootstrap(ownerId: string, workspace: Workspace): Promise<{
        record: WorkspaceRecord;
        created: boolean;
    }>;
    replace(ownerId: string, workspace: Workspace, expectedRevision: number): Promise<WorkspaceRecord>;
    setLogo(ownerId: string, path: string, expectedRevision: number): Promise<{
        previousPath: string | null;
        record: WorkspaceRecord;
    }>;
    clearLogo(ownerId: string, expectedRevision: number): Promise<{
        previousPath: string | null;
        record: WorkspaceRecord;
    }>;
    private updateLogo;
}
