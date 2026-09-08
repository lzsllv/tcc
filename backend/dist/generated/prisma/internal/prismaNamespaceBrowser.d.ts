import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.ts';
export type * from './prismaNamespace.ts';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Workspace: "Workspace";
    readonly BusinessSettings: "BusinessSettings";
    readonly FixedCosts: "FixedCosts";
    readonly FixedCostExtra: "FixedCostExtra";
    readonly Ingredient: "Ingredient";
    readonly Offer: "Offer";
    readonly OfferComponent: "OfferComponent";
    readonly SalesChannel: "SalesChannel";
    readonly ChannelFee: "ChannelFee";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const WorkspaceScalarFieldEnum: {
    readonly ownerId: "ownerId";
    readonly schemaVersion: "schemaVersion";
    readonly revision: "revision";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum];
export declare const BusinessSettingsScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly businessName: "businessName";
    readonly logoPath: "logoPath";
    readonly region: "region";
    readonly laborHourCents: "laborHourCents";
    readonly defaultMarginBps: "defaultMarginBps";
    readonly selectedSalesChannelId: "selectedSalesChannelId";
};
export type BusinessSettingsScalarFieldEnum = (typeof BusinessSettingsScalarFieldEnum)[keyof typeof BusinessSettingsScalarFieldEnum];
export declare const FixedCostsScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly aluguel: "aluguel";
    readonly energia: "energia";
    readonly internet: "internet";
    readonly salarios: "salarios";
    readonly outros: "outros";
};
export type FixedCostsScalarFieldEnum = (typeof FixedCostsScalarFieldEnum)[keyof typeof FixedCostsScalarFieldEnum];
export declare const FixedCostExtraScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly id: "id";
    readonly name: "name";
    readonly valueCents: "valueCents";
    readonly position: "position";
};
export type FixedCostExtraScalarFieldEnum = (typeof FixedCostExtraScalarFieldEnum)[keyof typeof FixedCostExtraScalarFieldEnum];
export declare const IngredientScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly id: "id";
    readonly name: "name";
    readonly category: "category";
    readonly purchasePriceCents: "purchasePriceCents";
    readonly purchaseQuantity: "purchaseQuantity";
    readonly purchaseUnit: "purchaseUnit";
    readonly active: "active";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type IngredientScalarFieldEnum = (typeof IngredientScalarFieldEnum)[keyof typeof IngredientScalarFieldEnum];
export declare const OfferScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly id: "id";
    readonly kind: "kind";
    readonly name: "name";
    readonly category: "category";
    readonly active: "active";
    readonly batchYield: "batchYield";
    readonly batchTimeMinutes: "batchTimeMinutes";
    readonly expectedMonthlySales: "expectedMonthlySales";
    readonly desiredMarginBps: "desiredMarginBps";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OfferScalarFieldEnum = (typeof OfferScalarFieldEnum)[keyof typeof OfferScalarFieldEnum];
export declare const OfferComponentScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly offerId: "offerId";
    readonly id: "id";
    readonly ingredientId: "ingredientId";
    readonly quantity: "quantity";
    readonly unit: "unit";
    readonly wasteBps: "wasteBps";
    readonly position: "position";
};
export type OfferComponentScalarFieldEnum = (typeof OfferComponentScalarFieldEnum)[keyof typeof OfferComponentScalarFieldEnum];
export declare const SalesChannelScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly id: "id";
    readonly name: "name";
    readonly active: "active";
    readonly isDefault: "isDefault";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SalesChannelScalarFieldEnum = (typeof SalesChannelScalarFieldEnum)[keyof typeof SalesChannelScalarFieldEnum];
export declare const ChannelFeeScalarFieldEnum: {
    readonly workspaceId: "workspaceId";
    readonly salesChannelId: "salesChannelId";
    readonly id: "id";
    readonly name: "name";
    readonly kind: "kind";
    readonly category: "category";
    readonly value: "value";
    readonly position: "position";
};
export type ChannelFeeScalarFieldEnum = (typeof ChannelFeeScalarFieldEnum)[keyof typeof ChannelFeeScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
