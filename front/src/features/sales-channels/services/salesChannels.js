const FEE_KINDS = new Set(['percentage', 'fixed']);
const FEE_CATEGORIES = new Set(['tax', 'payment', 'marketplace', 'other']);

function validateWorkspace(workspace) {
  if (!workspace?.ownerId || !Array.isArray(workspace.salesChannels) || !workspace.settings) {
    throw new TypeError('Workspace inválido para gerenciar canais de venda.');
  }
}

function channelIndex(workspace, channelId) {
  const index = workspace.salesChannels.findIndex(channel => channel.id === channelId);
  if (index < 0) throw new RangeError('Canal de venda não encontrado.');
  return index;
}

function normalizeFees(fees, feeIds = []) {
  if (!Array.isArray(fees)) throw new TypeError('Taxas do canal devem ser informadas.');
  const ids = new Set();
  let percentageTotal = 0;
  const normalized = fees.map((fee, index) => {
    const name = typeof fee?.name === 'string' ? fee.name.trim() : '';
    if (!name) throw new TypeError('Nome da taxa deve ser informado.');
    if (!FEE_KINDS.has(fee.kind)) throw new RangeError('Natureza da taxa inválida.');
    if (!FEE_CATEGORIES.has(fee.category)) throw new RangeError('Categoria da taxa inválida.');
    if (!Number.isInteger(fee.value) || fee.value < 0) throw new RangeError('Valor da taxa deve ser um inteiro não negativo.');
    if (fee.kind === 'percentage') percentageTotal += fee.value;
    const id = fee.id ?? feeIds[index] ?? crypto.randomUUID();
    if (ids.has(id)) throw new RangeError('Identificador de taxa duplicado.');
    ids.add(id);
    return { id, name, kind: fee.kind, category: fee.category, value: fee.value };
  });
  if (percentageTotal >= 10000) throw new RangeError('A soma das taxas percentuais deve ser menor que 100%.');
  return normalized;
}

function normalizeInput(input, feeIds) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  if (!name) throw new TypeError('Nome do canal deve ser informado.');
  return { name, fees: normalizeFees(input.fees ?? [], feeIds) };
}

function replaceChannel(workspace, index, channel, now, settings = workspace.settings) {
  return {
    ...workspace,
    salesChannels: workspace.salesChannels.map((current, position) => position === index ? channel : current),
    settings,
    updatedAt: now,
  };
}

export function createSalesChannel(workspace, input, options = {}) {
  validateWorkspace(workspace);
  const now = options.now ?? new Date().toISOString();
  const id = options.id ?? crypto.randomUUID();
  if (workspace.salesChannels.some(channel => channel.id === id)) {
    throw new RangeError('Já existe um canal com este identificador.');
  }
  const channel = {
    id,
    ownerId: workspace.ownerId,
    ...normalizeInput(input, options.feeIds),
    active: true,
    isDefault: workspace.salesChannels.length === 0,
    createdAt: now,
    updatedAt: now,
  };
  return { ...workspace, salesChannels: [...workspace.salesChannels, channel], updatedAt: now };
}

export function updateSalesChannel(workspace, channelId, input, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = channelIndex(workspace, channelId);
  const current = workspace.salesChannels[index];
  return replaceChannel(workspace, index, { ...current, ...normalizeInput(input), updatedAt: now }, now);
}

export function duplicateSalesChannel(workspace, channelId, options = {}) {
  validateWorkspace(workspace);
  const source = workspace.salesChannels[channelIndex(workspace, channelId)];
  return createSalesChannel(workspace, {
    name: `Cópia de ${source.name}`,
    fees: source.fees.map(fee => ({ name: fee.name, kind: fee.kind, category: fee.category, value: fee.value })),
  }, options);
}

export function setDefaultSalesChannel(workspace, channelId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = channelIndex(workspace, channelId);
  if (!workspace.salesChannels[index].active) throw new RangeError('Somente um canal ativo pode ser definido como padrão.');
  return {
    ...workspace,
    salesChannels: workspace.salesChannels.map((channel, position) => ({
      ...channel,
      isDefault: position === index,
      updatedAt: channel.isDefault !== (position === index) ? now : channel.updatedAt,
    })),
    updatedAt: now,
  };
}

export function selectSalesChannel(workspace, channelId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const channel = workspace.salesChannels[channelIndex(workspace, channelId)];
  if (!channel.active) throw new RangeError('Somente um canal ativo pode ser selecionado.');
  return {
    ...workspace,
    settings: { ...workspace.settings, selectedSalesChannelId: channelId },
    updatedAt: now,
  };
}

export function archiveSalesChannel(workspace, channelId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = channelIndex(workspace, channelId);
  const channel = workspace.salesChannels[index];
  const activeCount = workspace.salesChannels.filter(item => item.active).length;
  if (channel.active && activeCount <= 1) throw new RangeError('Não é possível arquivar o último canal ativo.');
  if (channel.isDefault) throw new RangeError('O canal padrão não pode ser arquivado. Defina outro canal como padrão primeiro.');
  const defaultId = workspace.salesChannels.find(item => item.isDefault && item.active)?.id;
  const settings = workspace.settings.selectedSalesChannelId === channelId
    ? { ...workspace.settings, selectedSalesChannelId: defaultId }
    : workspace.settings;
  return replaceChannel(workspace, index, { ...channel, active: false, updatedAt: now }, now, settings);
}

export function deleteSalesChannel(workspace, channelId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = channelIndex(workspace, channelId);
  const channel = workspace.salesChannels[index];
  if (channel.isDefault) throw new RangeError('O canal padrão não pode ser excluído.');
  if (workspace.settings.selectedSalesChannelId === channelId) {
    throw new RangeError('O canal selecionado não pode ser excluído. Selecione outro canal primeiro.');
  }
  return {
    ...workspace,
    salesChannels: workspace.salesChannels.filter((_, position) => position !== index),
    updatedAt: now,
  };
}
