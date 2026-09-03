import { describe, expect, it } from 'vitest';
import { WorkspaceConflictError, WorkspaceNotFoundError } from '../../src/errors/app-error.js';
import { WorkspaceApplicationService } from '../../src/application/workspace-service.js';
import type { Workspace, WorkspaceRecord, WorkspaceRepository } from '../../src/application/workspace-repository.js';
import { workspaceFixture } from '../fixtures/workspace.js';

class MemoryWorkspaceRepository implements WorkspaceRepository {
  private records = new Map<string, WorkspaceRecord>();

  async load(ownerId: string) { return this.records.get(ownerId) ?? null; }

  async bootstrap(ownerId: string, workspace: Workspace) {
    const existing = this.records.get(ownerId);
    if (existing) return { record: existing, created: false };
    const record = { workspace, revision: 1 };
    this.records.set(ownerId, record);
    return { record, created: true };
  }

  async replace(ownerId: string, workspace: Workspace, expectedRevision: number) {
    const existing = this.records.get(ownerId);
    if (!existing) throw new WorkspaceNotFoundError();
    if (existing.revision !== expectedRevision) throw new WorkspaceConflictError();
    const record = { workspace, revision: existing.revision + 1 };
    this.records.set(ownerId, record);
    return record;
  }
}

describe('WorkspaceApplicationService', () => {
  it('faz bootstrap idempotente sem substituir dados existentes', async () => {
    const service = new WorkspaceApplicationService(new MemoryWorkspaceRepository());
    const first = await service.bootstrap('owner-1', workspaceFixture);
    const changed = structuredClone(workspaceFixture);
    changed.settings.businessName = 'Tentativa de sobrescrita';

    const second = await service.bootstrap('owner-1', changed);

    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(second.record.workspace.settings.businessName).toBe('Doces da Ana');
  });

  it('incrementa revisão ao salvar com a versão esperada', async () => {
    const service = new WorkspaceApplicationService(new MemoryWorkspaceRepository());
    await service.bootstrap('owner-1', workspaceFixture);
    const changed = structuredClone(workspaceFixture);
    changed.settings.businessName = 'Novo nome';

    const saved = await service.save('owner-1', changed, 1);

    expect(saved.revision).toBe(2);
    expect(saved.workspace.settings.businessName).toBe('Novo nome');
  });

  it('rejeita atualização baseada em revisão antiga', async () => {
    const service = new WorkspaceApplicationService(new MemoryWorkspaceRepository());
    await service.bootstrap('owner-1', workspaceFixture);
    await service.save('owner-1', workspaceFixture, 1);

    await expect(service.save('owner-1', workspaceFixture, 1)).rejects.toBeInstanceOf(WorkspaceConflictError);
  });

  it('apresenta o logo assinado sem persistir a URL temporária', async () => {
    const repository = new MemoryWorkspaceRepository();
    const created = await new WorkspaceApplicationService(repository).bootstrap('owner-1', workspaceFixture);
    created.record.logoPath = 'owner-1/logo.webp';
    const service = new WorkspaceApplicationService(repository, {
      async present(record) {
        return { ...record, workspace: { ...record.workspace, settings: { ...record.workspace.settings, logo: 'https://signed.example/logo' } } };
      },
    });

    const loaded = await service.load('owner-1');

    expect(loaded.workspace.settings.logo).toBe('https://signed.example/logo');
    expect(created.record.workspace.settings.logo).toBe('');
  });
});
