import type { WorkspaceRepository } from './workspace-repository.js';
import type { WorkspaceRecord } from './workspace-repository.js';
interface WorkspacePresenter {
    present(record: WorkspaceRecord): Promise<WorkspaceRecord>;
}
export declare class WorkspaceApplicationService {
    private readonly repository;
    private readonly presenter?;
    constructor(repository: WorkspaceRepository, presenter?: WorkspacePresenter | undefined);
    private present;
    bootstrap(ownerId: string, input?: unknown): Promise<{
        record: WorkspaceRecord;
        created: boolean;
    }>;
    load(ownerId: string): Promise<WorkspaceRecord>;
    save(ownerId: string, input: unknown, expectedRevision: number): Promise<WorkspaceRecord>;
}
export {};
