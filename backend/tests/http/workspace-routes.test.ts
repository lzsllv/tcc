import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { WorkspaceApplicationService } from '../../src/application/workspace-service.js';
import type { Workspace, WorkspaceRecord, WorkspaceRepository } from '../../src/application/workspace-repository.js';
import { WorkspaceConflictError, WorkspaceNotFoundError } from '../../src/errors/app-error.js';
import { workspaceFixture } from '../fixtures/workspace.js';

class MemoryRepository implements WorkspaceRepository {
  records = new Map<string, WorkspaceRecord>();
  async load(owner: string) { return this.records.get(owner) ?? null; }
  async bootstrap(owner: string, workspace: Workspace) {
    const existing = this.records.get(owner);
    if (existing) return { record: existing, created: false };
    const record = { workspace, revision: 1 };
    this.records.set(owner, record);
    return { record, created: true };
  }
  async replace(owner: string, workspace: Workspace, expected: number) {
    const current = this.records.get(owner);
    if (!current) throw new WorkspaceNotFoundError();
    if (current.revision !== expected) throw new WorkspaceConflictError();
    const record = { workspace, revision: expected + 1 };
    this.records.set(owner, record);
    return record;
  }
}

const authVerifier = {
  async verify(token: string) {
    if (token !== 'valid-token') throw new Error('invalid');
    return '11111111-1111-4111-8111-111111111111';
  },
};

function app() {
  return createApp({ workspaceService: new WorkspaceApplicationService(new MemoryRepository()), authVerifier });
}

describe('workspace HTTP API', () => {
  it('protege todas as rotas de workspace', async () => {
    const response = await request(app()).get('/api/v1/workspace');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' } });
  });

  it('cria o workspace uma única vez com o proprietário autenticado', async () => {
    const application = app();
    const first = await request(application).post('/api/v1/workspace/bootstrap')
      .set('Authorization', 'Bearer valid-token').send({ workspace: workspaceFixture });
    const second = await request(application).post('/api/v1/workspace/bootstrap')
      .set('Authorization', 'Bearer valid-token').send({ workspace: workspaceFixture });

    expect(first.status).toBe(201);
    expect(first.body.workspace.ownerId).toBe('11111111-1111-4111-8111-111111111111');
    expect(first.body.revision).toBe(1);
    expect(second.status).toBe(200);
  });

  it('traduz validação de domínio para erro 422 estruturado', async () => {
    const response = await request(app()).post('/api/v1/workspace/bootstrap')
      .set('Authorization', 'Bearer valid-token').send({ workspace: { schemaVersion: 2 } });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('WORKSPACE_INVALID');
    expect(response.body.error.details).toBeInstanceOf(Array);
  });

  it('isola leitura, exportação e escrita pelo sub autenticado', async () => {
    const repository = new MemoryRepository();
    const verifier = {
      async verify(token: string) {
        if (token === 'token-a') return '11111111-1111-4111-8111-111111111111';
        if (token === 'token-b') return '22222222-2222-4222-8222-222222222222';
        throw new Error('invalid');
      },
    };
    const application = createApp({ workspaceService: new WorkspaceApplicationService(repository), authVerifier: verifier });
    await request(application).post('/api/v1/workspace/bootstrap')
      .set('Authorization', 'Bearer token-a').send({ workspace: workspaceFixture }).expect(201);

    await request(application).get('/api/v1/workspace')
      .set('Authorization', 'Bearer token-b').expect(404);
    await request(application).get('/api/v1/workspace/export')
      .set('Authorization', 'Bearer token-b').expect(404);

    const createdB = await request(application).post('/api/v1/workspace/bootstrap')
      .set('Authorization', 'Bearer token-b').send({ workspace: workspaceFixture }).expect(201);
    expect(createdB.body.workspace.ownerId).toBe('22222222-2222-4222-8222-222222222222');

    const changed = structuredClone(workspaceFixture);
    changed.settings.businessName = 'Somente B';
    const savedB = await request(application).put('/api/v1/workspace')
      .set('Authorization', 'Bearer token-b')
      .send({ workspace: changed, expectedRevision: 1 }).expect(200);
    expect(savedB.body.workspace.ownerId).toBe('22222222-2222-4222-8222-222222222222');

    const readA = await request(application).get('/api/v1/workspace')
      .set('Authorization', 'Bearer token-a').expect(200);
    expect(readA.body.workspace.settings.businessName).not.toBe('Somente B');
  });
});
