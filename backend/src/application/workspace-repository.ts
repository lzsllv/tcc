import type { Workspace } from '../domain/workspace.js';

export type { Workspace } from '../domain/workspace.js';

export interface WorkspaceRecord {
  workspace: Workspace;
  revision: number;
  logoPath?: string | null;
}

export interface WorkspaceRepository {
  load(ownerId: string): Promise<WorkspaceRecord | null>;
  bootstrap(ownerId: string, workspace: Workspace): Promise<{ record: WorkspaceRecord; created: boolean }>;
  replace(ownerId: string, workspace: Workspace, expectedRevision: number): Promise<WorkspaceRecord>;
}
