import { randomUUID } from 'node:crypto';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import { AppError } from '../../errors/app-error.js';

export const requestId: RequestHandler = (_request, response, next) => {
  const id = randomUUID();
  response.locals.requestId = id;
  response.setHeader('x-request-id', id);
  next();
};

export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, _next) => {
  if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
    response.status(413).json({ error: { code: 'LOGO_TOO_LARGE', message: 'O logo deve possuir no máximo 400 KB.' } });
    return;
  }
  if (error instanceof MulterError) {
    response.status(400).json({ error: { code: 'INVALID_MULTIPART', message: 'O envio do arquivo é inválido.' } });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.status).json({
      error: { code: error.code, message: error.message, ...(error.details === undefined ? {} : { details: error.details }) },
    });
    return;
  }
  if (error instanceof ZodError) {
    response.status(422).json({
      error: {
        code: 'WORKSPACE_INVALID',
        message: 'Os dados enviados são inválidos.',
        details: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      },
    });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: { code: 'INVALID_JSON', message: 'O corpo JSON é inválido.' } });
    return;
  }
  if ('log' in request && request.log && typeof request.log.error === 'function') {
    request.log.error({ err: error, requestId: response.locals.requestId }, 'Unhandled request error');
  }
  response.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor.', details: { requestId: response.locals.requestId } },
  });
};
