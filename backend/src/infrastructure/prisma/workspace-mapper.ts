import type { Workspace } from '../../domain/workspace.js';
import type { WorkspaceRecord } from '../../application/workspace-repository.js';

type DecimalLike = string | number | { toString(): string };

export interface WorkspaceGraph {
  ownerId: string;
  schemaVersion: number;
  revision: bigint;
  updatedAt: Date;
  settings: {
    businessName: string; logoPath: string | null; region: string; laborHourCents: bigint;
    defaultMarginBps: number; selectedSalesChannelId: string;
  };
  fixedCosts: { aluguel: bigint; energia: bigint; internet: bigint; salarios: bigint; outros: bigint };
  fixedCostExtras: Array<{ id: string; name: string; valueCents: bigint; position: number }>;
  ingredients: Array<{
    id: string; name: string; category: 'raw_material' | 'packaging' | 'other';
    purchasePriceCents: bigint; purchaseQuantity: DecimalLike; purchaseUnit: Workspace['ingredients'][number]['purchaseUnit'];
    active: boolean; createdAt: Date; updatedAt: Date;
  }>;
  offers: Array<{
    id: string; kind: 'product' | 'service'; name: string; category: string; active: boolean;
    batchYield: DecimalLike; batchTimeMinutes: DecimalLike; expectedMonthlySales: DecimalLike;
    desiredMarginBps: number | null; createdAt: Date; updatedAt: Date;
    components: Array<{
      id: string; ingredientId: string; quantity: DecimalLike;
      unit: Workspace['offers'][number]['components'][number]['unit']; wasteBps: number; position: number;
    }>;
  }>;
  salesChannels: Array<{
    id: string; name: string; active: boolean; isDefault: boolean; createdAt: Date; updatedAt: Date;
    fees: Array<{
      id: string; name: string; kind: 'percentage' | 'fixed';
      category: 'tax' | 'payment' | 'marketplace' | 'other'; value: bigint; position: number;
    }>;
  }>;
}

function safeNumber(value: bigint): number {
  const result = Number(value);
  if (!Number.isSafeInteger(result)) throw new RangeError('Valor persistido excede o limite seguro da API.');
  return result;
}

function decimalNumber(value: DecimalLike): number {
  const result = Number(value.toString());
  if (!Number.isFinite(result)) throw new RangeError('Quantidade decimal persistida é inválida.');
  return result;
}

export function toWorkspaceRows(workspace: Workspace) {
  const owner = workspace.ownerId;
  return {
    settings: {
      workspaceId: owner, businessName: workspace.settings.businessName, region: workspace.settings.region,
      laborHourCents: BigInt(workspace.settings.laborHourCents), defaultMarginBps: workspace.settings.defaultMarginBps,
      selectedSalesChannelId: workspace.settings.selectedSalesChannelId,
    },
    fixedCosts: {
      workspaceId: owner, aluguel: BigInt(workspace.fixedCosts.aluguel), energia: BigInt(workspace.fixedCosts.energia),
      internet: BigInt(workspace.fixedCosts.internet), salarios: BigInt(workspace.fixedCosts.salarios),
      outros: BigInt(workspace.fixedCosts.outros),
    },
    extras: workspace.fixedCosts.extras.map((extra, position) => ({
      workspaceId: owner, id: extra.id, name: extra.name, valueCents: BigInt(extra.valueCents), position,
    })),
    ingredients: workspace.ingredients.map((ingredient) => ({
      workspaceId: owner, id: ingredient.id, name: ingredient.name,
      category: ingredient.category === 'raw-material' ? 'raw_material' as const : ingredient.category,
      purchasePriceCents: BigInt(ingredient.purchasePriceCents), purchaseQuantity: ingredient.purchaseQuantity,
      purchaseUnit: ingredient.purchaseUnit, active: ingredient.active,
      createdAt: new Date(ingredient.createdAt), updatedAt: new Date(ingredient.updatedAt),
    })),
    offers: workspace.offers.map((offer) => ({
      workspaceId: owner, id: offer.id, kind: offer.kind, name: offer.name, category: offer.category,
      active: offer.active, batchYield: offer.batchYield, batchTimeMinutes: offer.batchTimeMinutes,
      expectedMonthlySales: offer.expectedMonthlySales, desiredMarginBps: offer.desiredMarginBps,
      createdAt: new Date(offer.createdAt), updatedAt: new Date(offer.updatedAt),
    })),
    components: workspace.offers.flatMap((offer) => offer.components.map((component, position) => ({
      workspaceId: owner, offerId: offer.id, id: component.id, ingredientId: component.ingredientId,
      quantity: component.quantity, unit: component.unit, wasteBps: component.wasteBps, position,
    }))),
    channels: workspace.salesChannels.map((channel) => ({
      workspaceId: owner, id: channel.id, name: channel.name, active: channel.active,
      isDefault: channel.isDefault, createdAt: new Date(channel.createdAt), updatedAt: new Date(channel.updatedAt),
    })),
    fees: workspace.salesChannels.flatMap((channel) => channel.fees.map((fee, position) => ({
      workspaceId: owner, salesChannelId: channel.id, id: fee.id, name: fee.name,
      kind: fee.kind, category: fee.category, value: BigInt(fee.value), position,
    }))),
  };
}

export function fromWorkspaceGraph(graph: WorkspaceGraph, signedLogoUrl = ''): WorkspaceRecord {
  const ownerId = graph.ownerId;
  return {
    revision: safeNumber(graph.revision),
    logoPath: graph.settings.logoPath,
    workspace: {
      schemaVersion: 2,
      ownerId,
      ingredients: graph.ingredients.map((ingredient) => ({
        id: ingredient.id, ownerId, name: ingredient.name,
        category: ingredient.category === 'raw_material' ? 'raw-material' : ingredient.category,
        purchasePriceCents: safeNumber(ingredient.purchasePriceCents),
        purchaseQuantity: decimalNumber(ingredient.purchaseQuantity), purchaseUnit: ingredient.purchaseUnit,
        active: ingredient.active, createdAt: ingredient.createdAt.toISOString(), updatedAt: ingredient.updatedAt.toISOString(),
      })),
      offers: graph.offers.map((offer) => ({
        id: offer.id, ownerId, kind: offer.kind, name: offer.name, category: offer.category, active: offer.active,
        batchYield: decimalNumber(offer.batchYield), batchTimeMinutes: decimalNumber(offer.batchTimeMinutes),
        expectedMonthlySales: decimalNumber(offer.expectedMonthlySales), desiredMarginBps: offer.desiredMarginBps,
        components: [...offer.components].sort((a, b) => a.position - b.position).map((component) => ({
          id: component.id, ingredientId: component.ingredientId, quantity: decimalNumber(component.quantity),
          unit: component.unit, wasteBps: component.wasteBps,
        })),
        createdAt: offer.createdAt.toISOString(), updatedAt: offer.updatedAt.toISOString(),
      })),
      salesChannels: graph.salesChannels.map((channel) => ({
        id: channel.id, ownerId, name: channel.name, active: channel.active, isDefault: channel.isDefault,
        fees: [...channel.fees].sort((a, b) => a.position - b.position).map((fee) => ({
          id: fee.id, name: fee.name, kind: fee.kind, category: fee.category, value: safeNumber(fee.value),
        })),
        createdAt: channel.createdAt.toISOString(), updatedAt: channel.updatedAt.toISOString(),
      })),
      fixedCosts: {
        aluguel: safeNumber(graph.fixedCosts.aluguel), energia: safeNumber(graph.fixedCosts.energia),
        internet: safeNumber(graph.fixedCosts.internet), salarios: safeNumber(graph.fixedCosts.salarios),
        outros: safeNumber(graph.fixedCosts.outros),
        extras: [...graph.fixedCostExtras].sort((a, b) => a.position - b.position).map((extra) => ({
          id: extra.id, name: extra.name, valueCents: safeNumber(extra.valueCents),
        })),
      },
      settings: {
        businessName: graph.settings.businessName, logo: signedLogoUrl, region: graph.settings.region,
        laborHourCents: safeNumber(graph.settings.laborHourCents), defaultMarginBps: graph.settings.defaultMarginBps,
        selectedSalesChannelId: graph.settings.selectedSalesChannelId,
      },
      updatedAt: graph.updatedAt.toISOString(),
    },
  };
}
