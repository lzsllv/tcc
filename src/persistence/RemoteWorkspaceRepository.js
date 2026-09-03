import { migrateLegacyData } from './migration.js';

const BACKUP_PREFIX = 'precifique:backup:v1:';
const PENDING_LOGO_PREFIX = 'precifique:pending-logo:v1:';
const SUPPORTED_LOGO = /^data:image\/(?:png|jpeg|webp);/i;

export class RemoteRepositoryError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'RemoteRepositoryError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function defaultDataUrlToFile(dataUrl) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const extension = blob.type === 'image/png' ? 'png' : blob.type === 'image/jpeg' ? 'jpg' : 'webp';
  return new File([blob], `logo.${extension}`, { type: blob.type });
}

export class RemoteWorkspaceRepository {
  constructor({
    baseUrl,
    getAccessToken,
    fetchImpl = globalThis.fetch.bind(globalThis),
    storage = globalThis.localStorage,
    now = () => new Date().toISOString(),
    dataUrlToFile = defaultDataUrlToFile,
  }) {
    if (!baseUrl || typeof getAccessToken !== 'function' || typeof fetchImpl !== 'function') {
      throw new TypeError('Configuração do repositório remoto é inválida.');
    }
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.getAccessToken = getAccessToken;
    this.fetchImpl = fetchImpl;
    this.storage = storage;
    this.now = now;
    this.dataUrlToFile = dataUrlToFile;
    this.revisions = new Map();
  }

  async authorizedHeaders(ownerId, extra = {}) {
    const token = await this.getAccessToken(ownerId);
    if (!token) throw new RemoteRepositoryError(401, 'UNAUTHORIZED', 'Sessão expirada. Entre novamente.');
    return { Authorization: `Bearer ${token}`, ...extra };
  }

  async parseResponse(response) {
    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const error = payload?.error ?? {};
      throw new RemoteRepositoryError(response.status, error.code ?? 'API_ERROR', error.message ?? 'Falha ao acessar a API.', error.details);
    }
    return payload;
  }

  async jsonRequest(ownerId, path, options = {}) {
    const headers = await this.authorizedHeaders(ownerId, options.body === undefined ? {} : { 'Content-Type': 'application/json' });
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, { ...options, headers });
    return { response, payload: await this.parseResponse(response) };
  }

  pendingLogoKey(ownerId) { return `${PENDING_LOGO_PREFIX}${ownerId}`; }

  async loadWorkspace(ownerId) {
    const response = await this.fetchImpl(`${this.baseUrl}/api/v1/workspace`, {
      headers: await this.authorizedHeaders(ownerId),
    });
    if (response.status === 404) return null;
    let record = await this.parseResponse(response);
    this.revisions.set(ownerId, record.revision);

    const pendingLogo = this.storage?.getItem?.(this.pendingLogoKey(ownerId));
    if (pendingLogo) {
      record = await this.uploadLogo(ownerId, pendingLogo, record.revision);
      this.storage.removeItem?.(this.pendingLogoKey(ownerId));
      this.clearLegacyData();
    }
    return record.workspace;
  }

  async saveWorkspace(ownerId, workspace) {
    const expectedRevision = this.revisions.get(ownerId);
    if (!Number.isInteger(expectedRevision)) {
      throw new RemoteRepositoryError(409, 'WORKSPACE_REVISION_MISSING', 'Recarregue o workspace antes de salvar.');
    }
    const { payload } = await this.jsonRequest(ownerId, '/api/v1/workspace', {
      method: 'PUT',
      body: JSON.stringify({ workspace, expectedRevision }),
    });
    this.revisions.set(ownerId, payload.revision);
    return payload.workspace;
  }

  async createBackup(ownerId, legacyData) {
    const key = `${BACKUP_PREFIX}${ownerId}`;
    if (this.storage?.getItem?.(key) == null) {
      this.storage.setItem(key, JSON.stringify({ ownerId, createdAt: this.now(), ...structuredClone(legacyData) }));
    }
    return key;
  }

  clearLegacyData() {
    for (const key of ['produtos', 'custosFixos', 'configuracoes']) this.storage?.removeItem?.(key);
  }

  async migrateWorkspace(ownerId, legacyData) {
    await this.createBackup(ownerId, legacyData);
    const workspace = migrateLegacyData(ownerId, legacyData, this.now());
    const legacyLogo = SUPPORTED_LOGO.test(workspace.settings.logo) ? workspace.settings.logo : '';
    const candidate = { ...workspace, settings: { ...workspace.settings, logo: '' } };
    if (legacyLogo) this.storage?.setItem?.(this.pendingLogoKey(ownerId), legacyLogo);
    const { payload } = await this.jsonRequest(ownerId, '/api/v1/workspace/bootstrap', {
      method: 'POST',
      body: JSON.stringify({ workspace: candidate }),
    });
    this.revisions.set(ownerId, payload.revision);
    const pendingLogo = this.storage?.getItem?.(this.pendingLogoKey(ownerId));
    if (pendingLogo && !payload.workspace.settings.logo) {
      const withLogo = await this.uploadLogo(ownerId, pendingLogo, payload.revision);
      this.storage?.removeItem?.(this.pendingLogoKey(ownerId));
      this.clearLegacyData();
      return withLogo.workspace;
    }
    if (pendingLogo) this.storage?.removeItem?.(this.pendingLogoKey(ownerId));
    this.clearLegacyData();
    return payload.workspace;
  }

  async uploadLogo(ownerId, dataUrl, expectedRevision) {
    const form = new FormData();
    form.set('expectedRevision', String(expectedRevision));
    form.set('logo', await this.dataUrlToFile(dataUrl));
    const response = await this.fetchImpl(`${this.baseUrl}/api/v1/workspace/logo`, {
      method: 'PUT', headers: await this.authorizedHeaders(ownerId), body: form,
    });
    const record = await this.parseResponse(response);
    this.revisions.set(ownerId, record.revision);
    return record;
  }

  async saveLogo(ownerId, dataUrl) {
    const expectedRevision = this.revisions.get(ownerId);
    if (!Number.isInteger(expectedRevision)) {
      throw new RemoteRepositoryError(409, 'WORKSPACE_REVISION_MISSING', 'Recarregue o workspace antes de salvar o logo.');
    }
    return (await this.uploadLogo(ownerId, dataUrl, expectedRevision)).workspace;
  }

  async deleteLogo(ownerId) {
    const expectedRevision = this.revisions.get(ownerId);
    if (!Number.isInteger(expectedRevision)) {
      throw new RemoteRepositoryError(409, 'WORKSPACE_REVISION_MISSING', 'Recarregue o workspace antes de remover o logo.');
    }
    const { payload } = await this.jsonRequest(ownerId, '/api/v1/workspace/logo', {
      method: 'DELETE',
      body: JSON.stringify({ expectedRevision }),
    });
    this.revisions.set(ownerId, payload.revision);
    return payload.workspace;
  }

  async exportWorkspace(ownerId) {
    if (!ownerId) throw new TypeError('ownerId is required');
    const response = await this.fetchImpl(`${this.baseUrl}/api/v1/workspace/export`, {
      headers: await this.authorizedHeaders(ownerId),
    });
    if (!response.ok) await this.parseResponse(response);
    return response.text();
  }
}
