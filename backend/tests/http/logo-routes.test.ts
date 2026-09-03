import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { parseWorkspace } from '../../src/domain/workspace.js';
import { workspaceFixture } from '../fixtures/workspace.js';

const authVerifier = { verify: async () => '11111111-1111-4111-8111-111111111111' };
const workspaceService = {} as never;

describe('logo HTTP API', () => {
  it('converte multipart em upload de logo com revisão otimista', async () => {
    const logoService = {
      async upload(ownerId: string, file: { mimeType: string }, revision: number) {
        const workspace = parseWorkspace(workspaceFixture, ownerId);
        workspace.settings.logo = 'https://signed.example/logo';
        expect(file.mimeType).toBe('image/webp');
        expect(revision).toBe(3);
        return { workspace, revision: 4 };
      },
      async remove() { throw new Error('not used'); },
    };
    const application = createApp({ workspaceService, authVerifier, logoService });

    const response = await request(application).put('/api/v1/workspace/logo')
      .set('Authorization', 'Bearer token')
      .field('expectedRevision', '3')
      .attach('logo', Buffer.from('image'), { filename: 'logo.webp', contentType: 'image/webp' });

    expect(response.status).toBe(200);
    expect(response.body.revision).toBe(4);
    expect(response.body.workspace.settings.logo).toBe('https://signed.example/logo');
  });

  it('responde 413 no envelope padrão quando o multipart excede 400 KB', async () => {
    const logoService = { upload: async () => { throw new Error('não deve executar'); }, remove: async () => { throw new Error('não deve executar'); } };
    const application = createApp({ workspaceService, authVerifier, logoService });

    const response = await request(application).put('/api/v1/workspace/logo')
      .set('Authorization', 'Bearer token')
      .field('expectedRevision', '1')
      .attach('logo', Buffer.alloc(409_601), { filename: 'logo.png', contentType: 'image/png' });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ error: { code: 'LOGO_TOO_LARGE', message: 'O logo deve possuir no máximo 400 KB.' } });
  });
});
