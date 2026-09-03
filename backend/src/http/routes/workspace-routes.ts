import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import type { WorkspaceApplicationService } from '../../application/workspace-service.js';
import type { UploadedLogo } from '../../application/logo-service.js';
import type { WorkspaceRecord } from '../../application/workspace-repository.js';
import { AppError } from '../../errors/app-error.js';

const saveBody = z.object({
  workspace: z.unknown(),
  expectedRevision: z.number().int().positive(),
}).strict();

export function workspaceRoutes(service: WorkspaceApplicationService) {
  const router = Router();

  router.post('/bootstrap', async (request, response) => {
    const result = await service.bootstrap(response.locals.ownerId, request.body?.workspace);
    response.status(result.created ? 201 : 200).json(result.record);
  });

  router.get('/', async (_request, response) => {
    response.json(await service.load(response.locals.ownerId));
  });

  router.put('/', async (request, response) => {
    const body = saveBody.parse(request.body);
    response.json(await service.save(response.locals.ownerId, body.workspace, body.expectedRevision));
  });

  router.get('/export', async (_request, response) => {
    const record = await service.load(response.locals.ownerId);
    response.attachment('precifique-workspace-v2.json');
    response.type('application/json').send(JSON.stringify(record.workspace, null, 2));
  });

  return router;
}

export interface LogoHttpService {
  upload(ownerId: string, file: UploadedLogo, expectedRevision: number): Promise<WorkspaceRecord>;
  remove(ownerId: string, expectedRevision: number): Promise<WorkspaceRecord>;
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 409_600, files: 1 } });
const revision = z.coerce.number().int().positive();

export function logoRoutes(service: LogoHttpService) {
  const router = Router();
  router.put('/', upload.single('logo'), async (request, response) => {
    if (!request.file) throw new AppError(400, 'LOGO_REQUIRED', 'O arquivo do logo deve ser informado.');
    const record = await service.upload(response.locals.ownerId, {
      buffer: request.file.buffer,
      mimeType: request.file.mimetype,
      size: request.file.size,
    }, revision.parse(request.body.expectedRevision));
    response.json(record);
  });
  router.delete('/', async (request, response) => {
    response.json(await service.remove(response.locals.ownerId, revision.parse(request.body?.expectedRevision)));
  });
  return router;
}
