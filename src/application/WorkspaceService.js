import { readLegacyData } from './legacyStorage.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export class WorkspaceService {
  constructor(repository, legacyStorage = globalThis.localStorage) {
    if (!repository?.loadWorkspace || !repository?.saveWorkspace || !repository?.migrateWorkspace) {
      throw new TypeError('Repositório de workspace compatível deve ser informado.');
    }
    this.repository = repository;
    this.legacyStorage = legacyStorage;
  }

  async initialize(ownerId) {
    const existing = await this.repository.loadWorkspace(ownerId);
    if (existing) return existing;
    const legacyData = readLegacyData(this.legacyStorage);
    return this.repository.migrateWorkspace(ownerId, legacyData);
  }

  async save(ownerId, workspace) {
    return this.repository.saveWorkspace(ownerId, workspace);
  }

  async update(ownerId, workspace, updater) {
    if (typeof updater !== 'function') {
      throw new TypeError('Atualizador do workspace deve ser uma função.');
    }
    const updated = updater(clone(workspace));
    return this.save(ownerId, updated);
  }

  async export(ownerId) {
    return this.repository.exportWorkspace(ownerId);
  }
}
