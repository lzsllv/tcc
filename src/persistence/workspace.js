export const WORKSPACE_SCHEMA_VERSION = 2;

export function assertOwnerId(ownerId) {
  if (typeof ownerId !== 'string' || !ownerId.trim()) {
    throw new TypeError('Proprietário do workspace deve ser informado.');
  }
}

export function createEmptyWorkspace(ownerId, updatedAt = new Date().toISOString()) {
  assertOwnerId(ownerId);
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    ownerId,
    ingredients: [],
    offers: [],
    salesChannels: [{
      id: 'channel-direct',
      ownerId,
      name: 'Venda direta',
      active: true,
      isDefault: true,
      fees: [],
      createdAt: updatedAt,
      updatedAt,
    }],
    fixedCosts: {
      aluguel: 0,
      energia: 0,
      internet: 0,
      salarios: 0,
      outros: 0,
      extras: [],
    },
    settings: {
      businessName: '',
      logo: '',
      region: '',
      laborHourCents: 0,
      defaultMarginBps: 0,
      selectedSalesChannelId: 'channel-direct',
    },
    updatedAt,
  };
}

export function assertWorkspace(ownerId, workspace) {
  assertOwnerId(ownerId);
  if (!workspace || workspace.schemaVersion !== WORKSPACE_SCHEMA_VERSION || workspace.ownerId !== ownerId) {
    throw new TypeError('Workspace incompatível com o proprietário ou versão esperada.');
  }
}
