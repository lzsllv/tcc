import { migrateLegacyData } from './migration.js';
import { assertOwnerId, assertWorkspace } from './workspace.js';

const WORKSPACE_PREFIX = 'precifique:workspace:v2:';
const BACKUP_PREFIX = 'precifique:backup:v1:';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeWorkspace(workspace) {
  if (!workspace || workspace.settings?.selectedSalesChannelId) return workspace;
  const selectedChannelId = workspace.salesChannels?.find(channel => channel.active && channel.isDefault)?.id
    ?? workspace.salesChannels?.find(channel => channel.active)?.id;
  return selectedChannelId
    ? { ...workspace, settings: { ...workspace.settings, selectedSalesChannelId: selectedChannelId } }
    : workspace;
}

export class LocalWorkspaceRepository {
  constructor(storage = globalThis.localStorage, now = () => new Date().toISOString()) {
    if (!storage?.getItem || !storage?.setItem) {
      throw new TypeError('Armazenamento local compatível deve ser informado.');
    }
    this.storage = storage;
    this.now = now;
  }

  workspaceKey(ownerId) {
    assertOwnerId(ownerId);
    return `${WORKSPACE_PREFIX}${ownerId}`;
  }

  async loadWorkspace(ownerId) {
    const serialized = this.storage.getItem(this.workspaceKey(ownerId));
    return serialized === null ? null : normalizeWorkspace(JSON.parse(serialized));
  }

  async saveWorkspace(ownerId, workspace) {
    assertWorkspace(ownerId, workspace);
    const snapshot = { ...clone(workspace), updatedAt: this.now() };
    this.storage.setItem(this.workspaceKey(ownerId), JSON.stringify(snapshot));
    return clone(snapshot);
  }

  async createBackup(ownerId, legacyData) {
    assertOwnerId(ownerId);
    const key = `${BACKUP_PREFIX}${this.now()}`;
    this.storage.setItem(key, JSON.stringify({ ownerId, ...clone(legacyData) }));
    return key;
  }

  async migrateWorkspace(ownerId, legacyData) {
    assertOwnerId(ownerId);
    const existing = await this.loadWorkspace(ownerId);
    if (existing) return existing;

    const timestamp = this.now();
    const workspace = migrateLegacyData(ownerId, legacyData, timestamp);
    await this.createBackup(ownerId, legacyData);
    return this.saveWorkspace(ownerId, workspace);
  }

  async exportWorkspace(ownerId) {
    const workspace = await this.loadWorkspace(ownerId);
    if (!workspace) {
      throw new ReferenceError('Workspace não encontrado para exportação.');
    }
    return JSON.stringify(workspace, null, 2);
  }
}
