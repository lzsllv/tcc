import { z } from 'zod';
declare const workspaceSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<2>;
    ownerId: z.ZodString;
    ingredients: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        ownerId: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<{
            "raw-material": "raw-material";
            packaging: "packaging";
            other: "other";
        }>;
        purchasePriceCents: z.ZodNumber;
        purchaseQuantity: z.ZodNumber;
        purchaseUnit: z.ZodEnum<{
            mg: "mg";
            g: "g";
            kg: "kg";
            ml: "ml";
            l: "l";
            un: "un";
            min: "min";
            h: "h";
        }>;
        active: z.ZodBoolean;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
    }, z.core.$strict>>;
    offers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        ownerId: z.ZodString;
        kind: z.ZodEnum<{
            product: "product";
            service: "service";
        }>;
        name: z.ZodString;
        category: z.ZodString;
        active: z.ZodBoolean;
        batchYield: z.ZodNumber;
        batchTimeMinutes: z.ZodNumber;
        expectedMonthlySales: z.ZodNumber;
        desiredMarginBps: z.ZodNullable<z.ZodNumber>;
        components: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            ingredientId: z.ZodString;
            quantity: z.ZodNumber;
            unit: z.ZodEnum<{
                mg: "mg";
                g: "g";
                kg: "kg";
                ml: "ml";
                l: "l";
                un: "un";
                min: "min";
                h: "h";
            }>;
            wasteBps: z.ZodNumber;
        }, z.core.$strict>>;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
    }, z.core.$strict>>;
    salesChannels: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        ownerId: z.ZodString;
        name: z.ZodString;
        active: z.ZodBoolean;
        isDefault: z.ZodBoolean;
        fees: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            kind: z.ZodEnum<{
                percentage: "percentage";
                fixed: "fixed";
            }>;
            category: z.ZodEnum<{
                other: "other";
                tax: "tax";
                payment: "payment";
                marketplace: "marketplace";
            }>;
            value: z.ZodNumber;
        }, z.core.$strict>>;
        createdAt: z.ZodISODateTime;
        updatedAt: z.ZodISODateTime;
    }, z.core.$strict>>;
    fixedCosts: z.ZodObject<{
        aluguel: z.ZodNumber;
        energia: z.ZodNumber;
        internet: z.ZodNumber;
        salarios: z.ZodNumber;
        outros: z.ZodNumber;
        extras: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valueCents: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    settings: z.ZodObject<{
        businessName: z.ZodString;
        logo: z.ZodString;
        region: z.ZodString;
        laborHourCents: z.ZodNumber;
        defaultMarginBps: z.ZodNumber;
        selectedSalesChannelId: z.ZodString;
    }, z.core.$strict>;
    updatedAt: z.ZodISODateTime;
}, z.core.$strict>;
export type Workspace = z.infer<typeof workspaceSchema>;
export declare function parseWorkspace(input: unknown, authenticatedOwnerId: string): Workspace;
export declare function createEmptyWorkspace(ownerId: string, now?: string): Workspace;
export {};
