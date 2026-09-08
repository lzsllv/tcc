import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.ts";
import * as Prisma from "./internal/prismaNamespace.ts";
export * as $Enums from './enums.ts';
export * from "./enums.ts";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Workspaces
 * const workspaces = await prisma.workspace.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Workspace
 *
 */
export type Workspace = Prisma.WorkspaceModel;
/**
 * Model BusinessSettings
 *
 */
export type BusinessSettings = Prisma.BusinessSettingsModel;
/**
 * Model FixedCosts
 *
 */
export type FixedCosts = Prisma.FixedCostsModel;
/**
 * Model FixedCostExtra
 *
 */
export type FixedCostExtra = Prisma.FixedCostExtraModel;
/**
 * Model Ingredient
 *
 */
export type Ingredient = Prisma.IngredientModel;
/**
 * Model Offer
 *
 */
export type Offer = Prisma.OfferModel;
/**
 * Model OfferComponent
 *
 */
export type OfferComponent = Prisma.OfferComponentModel;
/**
 * Model SalesChannel
 *
 */
export type SalesChannel = Prisma.SalesChannelModel;
/**
 * Model ChannelFee
 *
 */
export type ChannelFee = Prisma.ChannelFeeModel;
