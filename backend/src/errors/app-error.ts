export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
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
