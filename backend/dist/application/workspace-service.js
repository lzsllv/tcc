import { WorkspaceNotFoundError } from '../errors/app-error.js';
import { createEmptyWorkspace, parseWorkspace } from '../domain/workspace.js';
export class WorkspaceApplicationService {
    repository;
    presenter;
    constructor(repository, presenter) {
        this.repository = repository;
        this.presenter = presenter;
    }
    async present(record) {
        return this.presenter ? this.presenter.present(record) : record;
    }
    async bootstrap(ownerId, input) {
        const workspace = input === undefined
            ? createEmptyWorkspace(ownerId)
            : parseWorkspace(input, ownerId);
        const result = await this.repository.bootstrap(ownerId, workspace);
        return { ...result, record: await this.present(result.record) };
    }
    async load(ownerId) {
        const record = await this.repository.load(ownerId);
        if (!record)
            throw new WorkspaceNotFoundError();
        return this.present(record);
    }
    async save(ownerId, input, expectedRevision) {
        const workspace = parseWorkspace(input, ownerId);
        return this.present(await this.repository.replace(ownerId, workspace, expectedRevision));
    }
}
//# sourceMappingURL=workspace-service.js.map