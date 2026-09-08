import type { Workspace } from '../../domain/workspace.js';
import type { WorkspaceRecord } from '../../application/workspace-repository.js';
type DecimalLike = string | number | {
    toString(): string;
};
export interface WorkspaceGraph {
    ownerId: string;
    schemaVersion: number;
    revision: bigint;
    updatedAt: Date;
    settings: {
        businessName: string;
        logoPath: string | null;
        region: string;
        laborHourCents: bigint;
        defaultMarginBps: number;
        selectedSalesChannelId: string;
    };
    fixedCosts: {
        aluguel: bigint;
        energia: bigint;
        internet: bigint;
        salarios: bigint;
        outros: bigint;
    };
    fixedCostExtras: Array<{
        id: string;
        name: string;
        valueCents: bigint;
        position: number;
    }>;
    ingredients: Array<{
        id: string;
        name: string;
        category: 'raw_material' | 'packaging' | 'other';
        purchasePriceCents: bigint;
        purchaseQuantity: DecimalLike;
        purchaseUnit: Workspace['ingredients'][number]['purchaseUnit'];
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    offers: Array<{
        id: string;
        kind: 'product' | 'service';
        name: string;
        category: string;
        active: boolean;
        batchYield: DecimalLike;
        batchTimeMinutes: DecimalLike;
        expectedMonthlySales: DecimalLike;
        desiredMarginBps: number | null;
        createdAt: Date;
        updatedAt: Date;
        components: Array<{
            id: string;
            ingredientId: string;
            quantity: DecimalLike;
            unit: Workspace['offers'][number]['components'][number]['unit'];
            wasteBps: number;
            position: number;
        }>;
    }>;
    salesChannels: Array<{
        id: string;
        name: string;
        active: boolean;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
        fees: Array<{
            id: string;
            name: string;
            kind: 'percentage' | 'fixed';
            category: 'tax' | 'payment' | 'marketplace' | 'other';
            value: bigint;
            position: number;
        }>;
    }>;
}
export declare function toWorkspaceRows(workspace: Workspace): {
    settings: {
        workspaceId: string;
        businessName: string;
        region: string;
        laborHourCents: bigint;
        defaultMarginBps: number;
        selectedSalesChannelId: string;
    };
    fixedCosts: {
        workspaceId: string;
        aluguel: bigint;
        energia: bigint;
        internet: bigint;
        salarios: bigint;
        outros: bigint;
    };
    extras: {
        workspaceId: string;
        id: string;
        name: string;
        valueCents: bigint;
        position: number;
    }[];
    ingredients: {
        workspaceId: string;
        id: string;
        name: string;
        category: "packaging" | "other" | "raw_material";
        purchasePriceCents: bigint;
        purchaseQuantity: number;
        purchaseUnit: "mg" | "g" | "kg" | "ml" | "l" | "un" | "min" | "h";
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
    offers: {
        workspaceId: string;
        id: string;
        kind: "product" | "service";
        name: string;
        category: string;
        active: boolean;
        batchYield: number;
        batchTimeMinutes: number;
        expectedMonthlySales: number;
        desiredMarginBps: number | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
    components: {
        workspaceId: string;
        offerId: string;
        id: string;
        ingredientId: string;
        quantity: number;
        unit: "mg" | "g" | "kg" | "ml" | "l" | "un" | "min" | "h";
        wasteBps: number;
        position: number;
    }[];
    channels: {
        workspaceId: string;
        id: string;
        name: string;
        active: boolean;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
    fees: {
        workspaceId: string;
        salesChannelId: string;
        id: string;
        name: string;
        kind: "percentage" | "fixed";
        category: "other" | "tax" | "payment" | "marketplace";
        value: bigint;
        position: number;
    }[];
};
export declare function fromWorkspaceGraph(graph: WorkspaceGraph, signedLogoUrl?: string): WorkspaceRecord;
export {};
