import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { AppError } from './errors/app-error.js';
import { authenticate } from './http/middleware/authenticate.js';
import { errorHandler, requestId } from './http/middleware/error-handler.js';
import { logoRoutes, workspaceRoutes } from './http/routes/workspace-routes.js';
export function createApp(options = {}) {
    const app = express();
    app.disable('x-powered-by');
    app.use(requestId);
    if (options.logLevel) {
        app.use(pinoHttp({
            level: options.logLevel,
            genReqId: (_request, response) => String(response.getHeader('x-request-id')),
            redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
        }));
    }
    app.use(helmet());
    app.use(cors({ origin: options.corsOrigin ?? 'http://localhost:5173' }));
    app.use(express.json({ limit: '1mb' }));
    app.get('/health', (_request, response) => {
        response.json({ status: 'ok', service: 'precifique-backend' });
    });
    if (options.workspaceService && options.authVerifier) {
        const requireAuth = authenticate(options.authVerifier);
        app.use('/api/v1/workspace', requireAuth, workspaceRoutes(options.workspaceService));
        if (options.logoService)
            app.use('/api/v1/workspace/logo', requireAuth, logoRoutes(options.logoService));
    }
    app.use((_request, _response, next) => next(new AppError(404, 'NOT_FOUND', 'Rota não encontrada.')));
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map