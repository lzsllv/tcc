export declare class AppError extends Error {
    readonly status: number;
    readonly code: string;
    readonly details?: unknown | undefined;
    constructor(status: number, code: string, message: string, details?: unknown | undefined);
}
export declare class WorkspaceNotFoundError extends AppError {
    constructor();
}
export declare class WorkspaceConflictError extends AppError {
    constructor();
}
export declare class UnauthorizedError extends AppError {
    constructor();
}
