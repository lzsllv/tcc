import { UnauthorizedError } from '../../errors/app-error.js';
export function authenticate(verifier) {
    return async (request, response, next) => {
        const authorization = request.header('authorization');
        const match = /^Bearer ([^\s]+)$/.exec(authorization ?? '');
        if (!match)
            return next(new UnauthorizedError());
        try {
            response.locals.ownerId = await verifier.verify(match[1]);
            return next();
        }
        catch {
            return next(new UnauthorizedError());
        }
    };
}
//# sourceMappingURL=authenticate.js.map