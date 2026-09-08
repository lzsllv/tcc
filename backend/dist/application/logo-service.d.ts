import type { WorkspaceRecord } from './workspace-repository.js';
export interface UploadedLogo {
    buffer: Buffer;
    mimeType: string;
    size: number;
}
export interface LogoStorage {
    upload(ownerId: string, file: UploadedLogo): Promise<string>;
    remove(path: string): Promise<void>;
    signedUrl(path: string): Promise<string>;
}
export interface LogoMetadataRepository {
    setLogo(ownerId: string, path: string, expectedRevision: number): Promise<{
        previousPath: string | null;
        record: WorkspaceRecord;
    }>;
    clearLogo(ownerId: string, expectedRevision: number): Promise<{
        previousPath: string | null;
        record: WorkspaceRecord;
    }>;
}
export declare class LogoApplicationService {
    private readonly repository;
    private readonly storage;
    constructor(repository: LogoMetadataRepository, storage: LogoStorage);
    present(record: WorkspaceRecord): Promise<WorkspaceRecord>;
    upload(ownerId: string, file: UploadedLogo, expectedRevision: number): Promise<WorkspaceRecord>;
    remove(ownerId: string, expectedRevision: number): Promise<WorkspaceRecord>;
}
