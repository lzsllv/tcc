import { getUnitFamily } from '../domain/pricing/units.js';

const OFFER_KINDS = new Set(['product', 'service']);

function validateWorkspace(workspace) {
  if (!workspace?.ownerId || !Array.isArray(workspace.ingredients) || !Array.isArray(workspace.offers)) {
    throw new TypeError('Workspace inválido para gerenciar ofertas.');
  }
}

function assertNonNegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} deve ser um número não negativo.`);
  }
}

function findOfferIndex(workspace, offerId) {
  const index = workspace.offers.findIndex(offer => offer.id === offerId);
  if (index < 0) throw new RangeError('Oferta não encontrada.');
  return index;
}

function normalizeComponents(workspace, components, componentIds = [], allowedArchivedIds = new Set()) {
  if (!Array.isArray(components)) throw new TypeError('Componentes da ficha técnica devem ser informados.');
  const seen = new Set();
  return components.map((component, index) => {
    const ingredient = workspace.ingredients.find(item => item.id === component?.ingredientId);
    if (!ingredient) throw new ReferenceError('Insumo da ficha técnica não encontrado.');
    if (!ingredient.active && !allowedArchivedIds.has(ingredient.id)) {
      throw new RangeError(`O insumo ${ingredient.name} está arquivado.`);
    }
    if (seen.has(ingredient.id)) throw new RangeError('O mesmo insumo não pode aparecer duas vezes na ficha técnica.');
    seen.add(ingredient.id);
    if (!Number.isFinite(component.quantity) || component.quantity <= 0) {
      throw new RangeError('Quantidade do componente deve ser maior que zero.');
    }
    if (getUnitFamily(component.unit) !== getUnitFamily(ingredient.purchaseUnit)) {
      throw new RangeError(`A unidade de ${ingredient.name} não é compatível com a unidade de compra.`);
    }
    const wasteBps = component.wasteBps ?? 0;
    if (!Number.isInteger(wasteBps) || wasteBps < 0 || wasteBps > 10000) {
      throw new RangeError('Perda do componente deve estar entre 0 e 10000 pontos-base.');
    }
    return {
      id: component.id ?? componentIds[index] ?? crypto.randomUUID(),
      ingredientId: ingredient.id,
      quantity: component.quantity,
      unit: component.unit,
      wasteBps,
    };
  });
}

function normalizeOfferInput(workspace, input, componentIds, allowedArchivedIds = new Set()) {
  if (!OFFER_KINDS.has(input?.kind)) throw new RangeError('Tipo de oferta inválido.');
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name) throw new TypeError('Nome da oferta deve ser informado.');
  const category = typeof input.category === 'string' && input.category.trim() ? input.category.trim() : 'Outro';
  const batchYield = input.kind === 'service' ? 1 : input.batchYield;
  if (!Number.isFinite(batchYield) || batchYield <= 0) {
    throw new RangeError('Rendimento do lote deve ser maior que zero.');
  }
  assertNonNegative(input.batchTimeMinutes, 'Tempo do lote');
  assertNonNegative(input.expectedMonthlySales, 'Vendas mensais');
  const desiredMarginBps = input.desiredMarginBps ?? null;
  if (desiredMarginBps !== null && (!Number.isInteger(desiredMarginBps) || desiredMarginBps < 0 || desiredMarginBps > 10000)) {
    throw new RangeError('Margem desejada deve estar entre 0 e 10000 pontos-base.');
  }
  const effectiveMarginBps = desiredMarginBps ?? workspace.settings.defaultMarginBps;
  const invalidChannel = (workspace.salesChannels ?? []).filter(channel => channel.active).some(channel => {
    const percentageFeesBps = (channel.fees ?? [])
      .filter(fee => fee.kind === 'percentage')
      .reduce((total, fee) => total + fee.value, 0);
    return effectiveMarginBps + percentageFeesBps >= 10000;
  });
  if (invalidChannel) throw new RangeError('A soma da margem com as taxas percentuais deve ser menor que 100%.');
  return {
    kind: input.kind,
    name,
    category,
    batchYield,
    batchTimeMinutes: input.batchTimeMinutes,
    expectedMonthlySales: input.expectedMonthlySales,
    desiredMarginBps,
    components: normalizeComponents(workspace, input.components ?? [], componentIds, allowedArchivedIds),
  };
}

function replaceOffer(workspace, index, offer, now) {
  return {
    ...workspace,
    offers: workspace.offers.map((current, position) => position === index ? offer : current),
    updatedAt: now,
  };
}

export function createOffer(workspace, input, options = {}) {
  validateWorkspace(workspace);
  const now = options.now ?? new Date().toISOString();
  const id = options.id ?? crypto.randomUUID();
  if (workspace.offers.some(offer => offer.id === id)) throw new RangeError('Já existe uma oferta com este identificador.');
  const offer = {
    id,
    ownerId: workspace.ownerId,
    ...normalizeOfferInput(workspace, input, options.componentIds),
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  return { ...workspace, offers: [...workspace.offers, offer], updatedAt: now };
}

export function updateOffer(workspace, offerId, input, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = findOfferIndex(workspace, offerId);
  const current = workspace.offers[index];
  const allowedArchivedIds = new Set(current.components.map(component => component.ingredientId));
  const normalized = normalizeOfferInput(workspace, input, [], allowedArchivedIds);
  return replaceOffer(workspace, index, { ...current, ...normalized, updatedAt: now }, now);
}

export function archiveOffer(workspace, offerId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  const index = findOfferIndex(workspace, offerId);
  return replaceOffer(workspace, index, { ...workspace.offers[index], active: false, updatedAt: now }, now);
}

export function deleteOffer(workspace, offerId, now = new Date().toISOString()) {
  validateWorkspace(workspace);
  findOfferIndex(workspace, offerId);
  return { ...workspace, offers: workspace.offers.filter(offer => offer.id !== offerId), updatedAt: now };
}
