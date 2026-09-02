import type { WorkspaceRecord } from './workspace-repository.js';
import { AppError } from '../errors/app-error.js';

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
  setLogo(ownerId: string, path: string, expectedRevision: number): Promise<{ previousPath: string | null; record: WorkspaceRecord }>;
  clearLogo(ownerId: string, expectedRevision: number): Promise<{ previousPath: string | null; record: WorkspaceRecord }>;
}

const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);

export class LogoApplicationService {
  constructor(
    private readonly repository: LogoMetadataRepository,
    private readonly storage: LogoStorage,
  ) {}

  async present(record: WorkspaceRecord): Promise<WorkspaceRecord> {
    const { logoPath, ...publicRecord } = record;
    if (!logoPath) return publicRecord;
    const logo = await this.storage.signedUrl(logoPath);
    return { ...publicRecord, workspace: { ...record.workspace, settings: { ...record.workspace.settings, logo } } };
  }

  async upload(ownerId: string, file: UploadedLogo, expectedRevision: number): Promise<WorkspaceRecord> {
    if (!allowedTypes.has(file.mimeType)) {
      throw new AppError(415, 'UNSUPPORTED_LOGO_TYPE', 'O logo deve ser PNG, JPEG ou WebP.');
    }
    if (file.size > 409_600) {
      throw new AppError(413, 'LOGO_TOO_LARGE', 'O logo deve possuir no máximo 400 KB.');
    }

    const newPath = await this.storage.upload(ownerId, file);
    let changed: { previousPath: string | null; record: WorkspaceRecord };
    try {
      changed = await this.repository.setLogo(ownerId, newPath, expectedRevision);
    } catch (error) {
      await this.storage.remove(newPath).catch(() => undefined);
      throw error;
    }
    if (changed.previousPath && changed.previousPath !== newPath) {
      await this.storage.remove(changed.previousPath).catch(() => undefined);
    }
    return this.present(changed.record);
  }

  async remove(ownerId: string, expectedRevision: number): Promise<WorkspaceRecord> {
    const { previousPath, record } = await this.repository.clearLogo(ownerId, expectedRevision);
    if (previousPath) await this.storage.remove(previousPath).catch(() => undefined);
    return this.present(record);
  }
}
