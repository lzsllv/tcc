import { describe, expect, it } from 'vitest';
import { WorkspaceConflictError, WorkspaceNotFoundError } from '../../src/errors/app-error.js';
import { PrismaWorkspaceRepository } from '../../src/infrastructure/prisma/prisma-workspace-repository.js';
import { parseWorkspace } from '../../src/domain/workspace.js';
import { workspaceFixture } from '../fixtures/workspace.js';

function clientForMissingRevision(workspaceExists: boolean) {
  const transaction = {
    workspace: {
      updateMany: async () => ({ count: 0 }),
      findUnique: async () => workspaceExists ? { ownerId: 'owner-1' } : null,
    },
  };
  return { $transaction: async (operation: (tx: typeof transaction) => unknown) => operation(transaction) };
}

describe('PrismaWorkspaceRepository', () => {
  it('distingue conflito de revisão de workspace inexistente', async () => {
    const workspace = parseWorkspace(workspaceFixture, 'owner-1');
    const conflictRepository = new PrismaWorkspaceRepository(clientForMissingRevision(true));
    const missingRepository = new PrismaWorkspaceRepository(clientForMissingRevision(false));

    await expect(conflictRepository.replace('owner-1', workspace, 1)).rejects.toBeInstanceOf(WorkspaceConflictError);
    await expect(missingRepository.replace('owner-1', workspace, 1)).rejects.toBeInstanceOf(WorkspaceNotFoundError);
  });

  it('aplica o mesmo controle otimista ao trocar o logo', async () => {
    const repository = new PrismaWorkspaceRepository(clientForMissingRevision(true));
    await expect(repository.setLogo('owner-1', 'owner-1/new.webp', 1)).rejects.toBeInstanceOf(WorkspaceConflictError);
  });
});
