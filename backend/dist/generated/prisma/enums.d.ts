export declare const IngredientCategory: {
    readonly raw_material: "raw_material";
    readonly packaging: "packaging";
    readonly other: "other";
};
export type IngredientCategory = (typeof IngredientCategory)[keyof typeof IngredientCategory];
export declare const Unit: {
    readonly mg: "mg";
    readonly g: "g";
    readonly kg: "kg";
    readonly ml: "ml";
    readonly l: "l";
    readonly un: "un";
    readonly min: "min";
    readonly h: "h";
};
export type Unit = (typeof Unit)[keyof typeof Unit];
export declare const OfferKind: {
    readonly product: "product";
    readonly service: "service";
};
export type OfferKind = (typeof OfferKind)[keyof typeof OfferKind];
export declare const FeeKind: {
    readonly percentage: "percentage";
    readonly fixed: "fixed";
};
export type FeeKind = (typeof FeeKind)[keyof typeof FeeKind];
export declare const FeeCategory: {
    readonly tax: "tax";
    readonly payment: "payment";
    readonly marketplace: "marketplace";
    readonly other: "other";
};
export type FeeCategory = (typeof FeeCategory)[keyof typeof FeeCategory];
