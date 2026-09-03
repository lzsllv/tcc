import { z } from 'zod';

const id = z.string().trim().min(1).max(200);
const timestamp = z.iso.datetime({ offset: true });
const money = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const basisPoints = z.number().int().min(0).max(10_000);
const decimalMaximum = 99_999_999_999_999;
const quantity = z.number().finite().positive().max(decimalMaximum);
const nonNegativeQuantity = z.number().finite().min(0).max(decimalMaximum);
const unit = z.enum(['mg', 'g', 'kg', 'ml', 'l', 'un', 'min', 'h']);

const ingredientSchema = z.object({
  id,
  ownerId: id,
  name: z.string().trim().min(1).max(200),
  category: z.enum(['raw-material', 'packaging', 'other']),
  purchasePriceCents: money,
  purchaseQuantity: quantity,
  purchaseUnit: unit,
  active: z.boolean(),
  createdAt: timestamp,
  updatedAt: timestamp,
}).strict();

const componentSchema = z.object({
  id,
  ingredientId: id,
  quantity,
  unit,
  wasteBps: basisPoints,
}).strict();

const offerSchema = z.object({
  id,
  ownerId: id,
  kind: z.enum(['product', 'service']),
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(120),
  active: z.boolean(),
  batchYield: quantity,
  batchTimeMinutes: nonNegativeQuantity,
  expectedMonthlySales: nonNegativeQuantity,
  desiredMarginBps: basisPoints.nullable(),
  components: z.array(componentSchema).max(500),
  createdAt: timestamp,
  updatedAt: timestamp,
}).strict();

const feeSchema = z.object({
  id,
  name: z.string().trim().min(1).max(200),
  kind: z.enum(['percentage', 'fixed']),
  category: z.enum(['tax', 'payment', 'marketplace', 'other']),
  value: money,
}).strict();

const salesChannelSchema = z.object({
  id,
  ownerId: id,
  name: z.string().trim().min(1).max(200),
  active: z.boolean(),
  isDefault: z.boolean(),
  fees: z.array(feeSchema).max(100),
  createdAt: timestamp,
  updatedAt: timestamp,
}).strict();

const workspaceSchema = z.object({
  schemaVersion: z.literal(2),
  ownerId: id,
  ingredients: z.array(ingredientSchema).max(5_000),
  offers: z.array(offerSchema).max(5_000),
  salesChannels: z.array(salesChannelSchema).min(1).max(100),
  fixedCosts: z.object({
    aluguel: money,
    energia: money,
    internet: money,
    salarios: money,
    outros: money,
    extras: z.array(z.object({ id, name: z.string().trim().min(1).max(200), valueCents: money }).strict()).max(500),
  }).strict(),
  settings: z.object({
    businessName: z.string().max(200),
    logo: z.string().max(600_000),
    region: z.string().max(200),
    laborHourCents: money,
    defaultMarginBps: basisPoints,
    selectedSalesChannelId: id,
  }).strict(),
  updatedAt: timestamp,
}).strict().superRefine((workspace, context) => {
  const ingredientIds = new Set(workspace.ingredients.map((ingredient) => ingredient.id));
  const channelIds = new Set(workspace.salesChannels.map((channel) => channel.id));
  const activeDefaults = workspace.salesChannels.filter((channel) => channel.active && channel.isDefault);

  if (activeDefaults.length !== 1) {
    context.addIssue({ code: 'custom', path: ['salesChannels'], message: 'Workspace deve possuir exatamente um canal padrão ativo.' });
  }
  if (!channelIds.has(workspace.settings.selectedSalesChannelId)) {
    context.addIssue({ code: 'custom', path: ['settings', 'selectedSalesChannelId'], message: 'Canal selecionado inexistente.' });
  }
  for (const [offerIndex, offer] of workspace.offers.entries()) {
    const componentIngredients = new Set<string>();
    for (const [componentIndex, component] of offer.components.entries()) {
      if (!ingredientIds.has(component.ingredientId)) {
        context.addIssue({
          code: 'custom', path: ['offers', offerIndex, 'components', componentIndex, 'ingredientId'],
          message: 'Componente referencia insumo inexistente.',
        });
      }
      if (componentIngredients.has(component.ingredientId)) {
        context.addIssue({ code: 'custom', path: ['offers', offerIndex, 'components'], message: 'Insumo duplicado na oferta.' });
      }
      componentIngredients.add(component.ingredientId);
    }
  }
  for (const [channelIndex, channel] of workspace.salesChannels.entries()) {
    const percentageTotal = channel.fees
      .filter((fee) => fee.kind === 'percentage')
      .reduce((total, fee) => total + fee.value, 0);
    if (percentageTotal >= 10_000) {
      context.addIssue({ code: 'custom', path: ['salesChannels', channelIndex, 'fees'], message: 'Taxas percentuais devem somar menos de 100%.' });
    }
  }
});

export type Workspace = z.infer<typeof workspaceSchema>;

export function parseWorkspace(input: unknown, authenticatedOwnerId: string): Workspace {
  const workspace = workspaceSchema.parse(input);
  return {
    ...workspace,
    ownerId: authenticatedOwnerId,
    ingredients: workspace.ingredients.map((ingredient) => ({ ...ingredient, ownerId: authenticatedOwnerId })),
    offers: workspace.offers.map((offer) => ({ ...offer, ownerId: authenticatedOwnerId })),
    salesChannels: workspace.salesChannels.map((channel) => ({ ...channel, ownerId: authenticatedOwnerId })),
  };
}

export function createEmptyWorkspace(ownerId: string, now = new Date().toISOString()): Workspace {
  return parseWorkspace({
    schemaVersion: 2,
    ownerId,
    ingredients: [],
    offers: [],
    salesChannels: [{
      id: 'channel-direct', ownerId, name: 'Venda direta', active: true, isDefault: true,
      fees: [], createdAt: now, updatedAt: now,
    }],
    fixedCosts: { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
    settings: {
      businessName: '', logo: '', region: '', laborHourCents: 0, defaultMarginBps: 0,
      selectedSalesChannelId: 'channel-direct',
    },
    updatedAt: now,
  }, ownerId);
}
