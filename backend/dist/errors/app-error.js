export class AppError extends Error {
    status;
    code;
    details;
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        this.name = new.target.name;
    }
}
export class WorkspaceNotFoundError extends AppError {
    constructor() { super(404, 'WORKSPACE_NOT_FOUND', 'Workspace não encontrado.'); }
}
export class WorkspaceConflictError extends AppError {
    constructor() { super(409, 'WORKSPACE_CONFLICT', 'O workspace foi alterado em outra sessão. Recarregue os dados.'); }
}
export class UnauthorizedError extends AppError {
    constructor() { super(401, 'UNAUTHORIZED', 'Autenticação necessária.'); }
}
//# sourceMappingURL=app-error.js.map