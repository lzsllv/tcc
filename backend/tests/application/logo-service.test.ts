import { describe, expect, it } from 'vitest';
import { LogoApplicationService, type LogoMetadataRepository, type LogoStorage } from '../../src/application/logo-service.js';
import { AppError, WorkspaceConflictError } from '../../src/errors/app-error.js';
import type { WorkspaceRecord } from '../../src/application/workspace-repository.js';
import { parseWorkspace } from '../../src/domain/workspace.js';
import { workspaceFixture } from '../fixtures/workspace.js';

class MemoryStorage implements LogoStorage {
  objects = new Set<string>();
  async upload(ownerId: string) { const path = `${ownerId}/new.webp`; this.objects.add(path); return path; }
  async remove(path: string) { this.objects.delete(path); }
  async signedUrl(path: string) { return `https://signed.example/${path}`; }
}

class MemoryMetadata implements LogoMetadataRepository {
  path: string | null = 'owner-1/old.webp';
  revision = 1;
  async setLogo(_owner: string, path: string, expected: number) {
    if (expected !== this.revision) throw new WorkspaceConflictError();
    const previousPath = this.path;
    this.path = path;
    this.revision += 1;
    return { previousPath, record: this.record() };
  }
  async clearLogo(_owner: string, expected: number) {
    if (expected !== this.revision) throw new WorkspaceConflictError();
    const previousPath = this.path;
    this.path = null;
    this.revision += 1;
    return { previousPath, record: this.record() };
  }
  private record(): WorkspaceRecord {
    return { workspace: parseWorkspace(workspaceFixture, 'owner-1'), revision: this.revision, logoPath: this.path };
  }
}

const image = { buffer: Buffer.from('image'), mimeType: 'image/webp', size: 5 };

describe('LogoApplicationService', () => {
  it('recusa imagem acima de 400 KB antes de enviar ao storage', async () => {
    const storage = new MemoryStorage();
    const service = new LogoApplicationService(new MemoryMetadata(), storage);
    await expect(service.upload('owner-1', { ...image, size: 409601 }, 1))
      .rejects.toMatchObject({ status: 413, code: 'LOGO_TOO_LARGE' });
    expect(storage.objects.size).toBe(0);
  });

  it('mantém o logo anterior se a exclusão usa revisão antiga', async () => {
    const storage = new MemoryStorage();
    storage.objects.add('owner-1/old.webp');
    const metadata = new MemoryMetadata();
    const service = new LogoApplicationService(metadata, storage);
    await expect(service.remove('owner-1', 0)).rejects.toBeInstanceOf(WorkspaceConflictError);
    expect(metadata.path).toBe('owner-1/old.webp');
    expect(storage.objects.has('owner-1/old.webp')).toBe(true);
  });

  it('remove o upload novo quando a revisão entra em conflito', async () => {
    const storage = new MemoryStorage();
    const service = new LogoApplicationService(new MemoryMetadata(), storage);

    await expect(service.upload('owner-1', image, 9)).rejects.toBeInstanceOf(WorkspaceConflictError);
    expect(storage.objects.size).toBe(0);
  });

  it('preserva o objeto já commitado quando apenas a assinatura da URL falha', async () => {
    const storage = new MemoryStorage();
    storage.signedUrl = async () => { throw new Error('falha transitória'); };
    const metadata = new MemoryMetadata();
    const service = new LogoApplicationService(metadata, storage);

    await expect(service.upload('owner-1', image, 1)).rejects.toThrow('falha transitória');

    expect(metadata.path).toBe('owner-1/new.webp');
    expect(metadata.revision).toBe(2);
    expect(storage.objects.has('owner-1/new.webp')).toBe(true);
  });

  it('publica URL assinada e remove o objeto substituído depois do commit', async () => {
    const storage = new MemoryStorage();
    storage.objects.add('owner-1/old.webp');
    const service = new LogoApplicationService(new MemoryMetadata(), storage);

    const record = await service.upload('owner-1', image, 1);

    expect(record.revision).toBe(2);
    expect(record.workspace.settings.logo).toContain('https://signed.example/owner-1/new.webp');
    expect(record).not.toHaveProperty('logoPath');
    expect(storage.objects.has('owner-1/old.webp')).toBe(false);
  });

  it('recusa mídia fora dos formatos permitidos', async () => {
    const service = new LogoApplicationService(new MemoryMetadata(), new MemoryStorage());
    await expect(service.upload('owner-1', { ...image, mimeType: 'image/svg+xml' }, 1))
      .rejects.toMatchObject<AppError>({ status: 415, code: 'UNSUPPORTED_LOGO_TYPE' });
  });

  it('remove o vínculo transacional antes de apagar o objeto antigo', async () => {
    const storage = new MemoryStorage();
    storage.objects.add('owner-1/old.webp');
    const metadata = new MemoryMetadata();
    const service = new LogoApplicationService(metadata, storage);

    const record = await service.remove('owner-1', 1);

    expect(record.revision).toBe(2);
    expect(record).not.toHaveProperty('logoPath');
    expect(metadata.path).toBeNull();
    expect(storage.objects.has('owner-1/old.webp')).toBe(false);
  });
});
