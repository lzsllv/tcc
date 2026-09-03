import { WorkspaceNotFoundError } from '../errors/app-error.js';
import { createEmptyWorkspace, parseWorkspace } from '../domain/workspace.js';
import type { WorkspaceRepository } from './workspace-repository.js';
import type { WorkspaceRecord } from './workspace-repository.js';

interface WorkspacePresenter {
  present(record: WorkspaceRecord): Promise<WorkspaceRecord>;
}

export class WorkspaceApplicationService {
  constructor(
    private readonly repository: WorkspaceRepository,
    private readonly presenter?: WorkspacePresenter,
  ) {}

  private async present(record: WorkspaceRecord) {
    return this.presenter ? this.presenter.present(record) : record;
  }

  async bootstrap(ownerId: string, input?: unknown) {
    const workspace = input === undefined
      ? createEmptyWorkspace(ownerId)
      : parseWorkspace(input, ownerId);
    const result = await this.repository.bootstrap(ownerId, workspace);
    return { ...result, record: await this.present(result.record) };
  }

  async load(ownerId: string) {
    const record = await this.repository.load(ownerId);
    if (!record) throw new WorkspaceNotFoundError();
    return this.present(record);
  }

  async save(ownerId: string, input: unknown, expectedRevision: number) {
    const workspace = parseWorkspace(input, ownerId);
    return this.present(await this.repository.replace(ownerId, workspace, expectedRevision));
  }
}
