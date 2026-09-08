import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.ts";
import { type PrismaClient } from "./class.ts";
export type * from '../models.ts';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.10.0
 * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * Resolved type of the argument passed to the `PrismaClient` constructor.
 *
 * When called without a narrower options type (the common case), this resolves
 * to `PrismaClientOptions` directly, which produces a clear TypeScript error
 * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
 * the argument is missing or incomplete. When the user supplies a narrower
 * options type (e.g. via a literal), it falls back to `Subset` to keep
 * filtering out unknown properties.
 */
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "workspace" | "businessSettings" | "fixedCosts" | "fixedCostExtra" | "ingredient" | "offer" | "offerComponent" | "salesChannel" | "channelFee";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Workspace: {
            payload: Prisma.$WorkspacePayload<ExtArgs>;
            fields: Prisma.WorkspaceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                create: {
                    args: Prisma.WorkspaceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                update: {
                    args: Prisma.WorkspaceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspace>;
                };
                groupBy: {
                    args: Prisma.WorkspaceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceCountAggregateOutputType> | number;
                };
            };
        };
        BusinessSettings: {
            payload: Prisma.$BusinessSettingsPayload<ExtArgs>;
            fields: Prisma.BusinessSettingsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BusinessSettingsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BusinessSettingsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>;
                };
                findFirst: {
                    args: Prisma.BusinessSettingsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BusinessSettingsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>;
                };
                findMany: {
                    args: Prisma.BusinessSettingsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>[];
                };
                create: {
                    args: Prisma.BusinessSettingsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>;
                };
                createMany: {
                    args: Prisma.BusinessSettingsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BusinessSettingsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>[];
                };
                delete: {
                    args: Prisma.BusinessSettingsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>;
                };
                update: {
                    args: Prisma.BusinessSettingsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>;
                };
                deleteMany: {
                    args: Prisma.BusinessSettingsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BusinessSettingsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BusinessSettingsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>[];
                };
                upsert: {
                    args: Prisma.BusinessSettingsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BusinessSettingsPayload>;
                };
                aggregate: {
                    args: Prisma.BusinessSettingsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBusinessSettings>;
                };
                groupBy: {
                    args: Prisma.BusinessSettingsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BusinessSettingsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BusinessSettingsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BusinessSettingsCountAggregateOutputType> | number;
                };
            };
        };
        FixedCosts: {
            payload: Prisma.$FixedCostsPayload<ExtArgs>;
            fields: Prisma.FixedCostsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FixedCostsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FixedCostsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>;
                };
                findFirst: {
                    args: Prisma.FixedCostsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FixedCostsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>;
                };
                findMany: {
                    args: Prisma.FixedCostsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>[];
                };
                create: {
                    args: Prisma.FixedCostsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>;
                };
                createMany: {
                    args: Prisma.FixedCostsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FixedCostsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>[];
                };
                delete: {
                    args: Prisma.FixedCostsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>;
                };
                update: {
                    args: Prisma.FixedCostsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>;
                };
                deleteMany: {
                    args: Prisma.FixedCostsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FixedCostsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FixedCostsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>[];
                };
                upsert: {
                    args: Prisma.FixedCostsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostsPayload>;
                };
                aggregate: {
                    args: Prisma.FixedCostsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFixedCosts>;
                };
                groupBy: {
                    args: Prisma.FixedCostsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FixedCostsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FixedCostsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FixedCostsCountAggregateOutputType> | number;
                };
            };
        };
        FixedCostExtra: {
            payload: Prisma.$FixedCostExtraPayload<ExtArgs>;
            fields: Prisma.FixedCostExtraFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FixedCostExtraFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FixedCostExtraFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>;
                };
                findFirst: {
                    args: Prisma.FixedCostExtraFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FixedCostExtraFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>;
                };
                findMany: {
                    args: Prisma.FixedCostExtraFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>[];
                };
                create: {
                    args: Prisma.FixedCostExtraCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>;
                };
                createMany: {
                    args: Prisma.FixedCostExtraCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FixedCostExtraCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>[];
                };
                delete: {
                    args: Prisma.FixedCostExtraDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>;
                };
                update: {
                    args: Prisma.FixedCostExtraUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>;
                };
                deleteMany: {
                    args: Prisma.FixedCostExtraDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FixedCostExtraUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FixedCostExtraUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>[];
                };
                upsert: {
                    args: Prisma.FixedCostExtraUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FixedCostExtraPayload>;
                };
                aggregate: {
                    args: Prisma.FixedCostExtraAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFixedCostExtra>;
                };
                groupBy: {
                    args: Prisma.FixedCostExtraGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FixedCostExtraGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FixedCostExtraCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FixedCostExtraCountAggregateOutputType> | number;
                };
            };
        };
        Ingredient: {
            payload: Prisma.$IngredientPayload<ExtArgs>;
            fields: Prisma.IngredientFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.IngredientFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.IngredientFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>;
                };
                findFirst: {
                    args: Prisma.IngredientFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.IngredientFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>;
                };
                findMany: {
                    args: Prisma.IngredientFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>[];
                };
                create: {
                    args: Prisma.IngredientCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>;
                };
                createMany: {
                    args: Prisma.IngredientCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.IngredientCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>[];
                };
                delete: {
                    args: Prisma.IngredientDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>;
                };
                update: {
                    args: Prisma.IngredientUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>;
                };
                deleteMany: {
                    args: Prisma.IngredientDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.IngredientUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.IngredientUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>[];
                };
                upsert: {
                    args: Prisma.IngredientUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IngredientPayload>;
                };
                aggregate: {
                    args: Prisma.IngredientAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIngredient>;
                };
                groupBy: {
                    args: Prisma.IngredientGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IngredientGroupByOutputType>[];
                };
                count: {
                    args: Prisma.IngredientCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IngredientCountAggregateOutputType> | number;
                };
            };
        };
        Offer: {
            payload: Prisma.$OfferPayload<ExtArgs>;
            fields: Prisma.OfferFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OfferFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OfferFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>;
                };
                findFirst: {
                    args: Prisma.OfferFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OfferFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>;
                };
                findMany: {
                    args: Prisma.OfferFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>[];
                };
                create: {
                    args: Prisma.OfferCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>;
                };
                createMany: {
                    args: Prisma.OfferCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OfferCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>[];
                };
                delete: {
                    args: Prisma.OfferDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>;
                };
                update: {
                    args: Prisma.OfferUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>;
                };
                deleteMany: {
                    args: Prisma.OfferDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OfferUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OfferUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>[];
                };
                upsert: {
                    args: Prisma.OfferUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferPayload>;
                };
                aggregate: {
                    args: Prisma.OfferAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOffer>;
                };
                groupBy: {
                    args: Prisma.OfferGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OfferGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OfferCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OfferCountAggregateOutputType> | number;
                };
            };
        };
        OfferComponent: {
            payload: Prisma.$OfferComponentPayload<ExtArgs>;
            fields: Prisma.OfferComponentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OfferComponentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OfferComponentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>;
                };
                findFirst: {
                    args: Prisma.OfferComponentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OfferComponentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>;
                };
                findMany: {
                    args: Prisma.OfferComponentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>[];
                };
                create: {
                    args: Prisma.OfferComponentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>;
                };
                createMany: {
                    args: Prisma.OfferComponentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OfferComponentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>[];
                };
                delete: {
                    args: Prisma.OfferComponentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>;
                };
                update: {
                    args: Prisma.OfferComponentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>;
                };
                deleteMany: {
                    args: Prisma.OfferComponentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OfferComponentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OfferComponentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>[];
                };
                upsert: {
                    args: Prisma.OfferComponentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OfferComponentPayload>;
                };
                aggregate: {
                    args: Prisma.OfferComponentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOfferComponent>;
                };
                groupBy: {
                    args: Prisma.OfferComponentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OfferComponentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OfferComponentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OfferComponentCountAggregateOutputType> | number;
                };
            };
        };
        SalesChannel: {
            payload: Prisma.$SalesChannelPayload<ExtArgs>;
            fields: Prisma.SalesChannelFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SalesChannelFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SalesChannelFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>;
                };
                findFirst: {
                    args: Prisma.SalesChannelFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SalesChannelFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>;
                };
                findMany: {
                    args: Prisma.SalesChannelFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>[];
                };
                create: {
                    args: Prisma.SalesChannelCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>;
                };
                createMany: {
                    args: Prisma.SalesChannelCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SalesChannelCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>[];
                };
                delete: {
                    args: Prisma.SalesChannelDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>;
                };
                update: {
                    args: Prisma.SalesChannelUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>;
                };
                deleteMany: {
                    args: Prisma.SalesChannelDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SalesChannelUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SalesChannelUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>[];
                };
                upsert: {
                    args: Prisma.SalesChannelUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalesChannelPayload>;
                };
                aggregate: {
                    args: Prisma.SalesChannelAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSalesChannel>;
                };
                groupBy: {
                    args: Prisma.SalesChannelGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SalesChannelGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SalesChannelCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SalesChannelCountAggregateOutputType> | number;
                };
            };
        };
        ChannelFee: {
            payload: Prisma.$ChannelFeePayload<ExtArgs>;
            fields: Prisma.ChannelFeeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ChannelFeeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ChannelFeeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>;
                };
                findFirst: {
                    args: Prisma.ChannelFeeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ChannelFeeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>;
                };
                findMany: {
                    args: Prisma.ChannelFeeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>[];
                };
                create: {
                    args: Prisma.ChannelFeeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>;
                };
                createMany: {
                    args: Prisma.ChannelFeeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ChannelFeeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>[];
                };
                delete: {
                    args: Prisma.ChannelFeeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>;
                };
                update: {
                    args: Prisma.ChannelFeeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>;
                };
                deleteMany: {
                    args: Prisma.ChannelFeeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ChannelFeeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ChannelFeeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>[];
                };
                upsert: {
                    args: Prisma.ChannelFeeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ChannelFeePayload>;
                };
                aggregate: {
                    args: Prisma.ChannelFeeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateChannelFee>;
                };
                groupBy: {
                    args: Prisma.ChannelFeeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelFeeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ChannelFeeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ChannelFeeCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
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
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'BigInt'
 */
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
/**
 * Reference to a field of type 'BigInt[]'
 */
export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'IngredientCategory'
 */
export type EnumIngredientCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IngredientCategory'>;
/**
 * Reference to a field of type 'IngredientCategory[]'
 */
export type ListEnumIngredientCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IngredientCategory[]'>;
/**
 * Reference to a field of type 'Decimal'
 */
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
/**
 * Reference to a field of type 'Decimal[]'
 */
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
/**
 * Reference to a field of type 'Unit'
 */
export type EnumUnitFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Unit'>;
/**
 * Reference to a field of type 'Unit[]'
 */
export type ListEnumUnitFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Unit[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'OfferKind'
 */
export type EnumOfferKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OfferKind'>;
/**
 * Reference to a field of type 'OfferKind[]'
 */
export type ListEnumOfferKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OfferKind[]'>;
/**
 * Reference to a field of type 'FeeKind'
 */
export type EnumFeeKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeeKind'>;
/**
 * Reference to a field of type 'FeeKind[]'
 */
export type ListEnumFeeKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeeKind[]'>;
/**
 * Reference to a field of type 'FeeCategory'
 */
export type EnumFeeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeeCategory'>;
/**
 * Reference to a field of type 'FeeCategory[]'
 */
export type ListEnumFeeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeeCategory[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
/**
 * Options common to all variants of `PrismaClientOptions`, regardless of whether you connect to your database through a driver adapter or through Prisma Accelerate.
 */
export interface PrismaClientBaseOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
    /**
     * Optional maximum size for the query plan cache. If not provided, a default size will be used.
     * A value of `0` can be used to disable the cache entirely. A higher cache size can improve
     * performance for applications that execute a large number of unique queries, while a smaller
     * cache size can reduce memory usage.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   queryPlanCacheMaxSize: 100,
     * })
     * ```
     */
    queryPlanCacheMaxSize?: number;
}
/**
 * `PrismaClient` options for connecting to your database through Prisma Accelerate instead of a driver adapter.
 *
 * Learn more: https://pris.ly/d/accelerate
 */
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     *
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl: string;
    adapter?: never;
}
/**
 * `PrismaClient` options for connecting to your database through a driver adapter. This is the common case in Prisma 7.
 *
 * Learn more: https://pris.ly/d/driver-adapters
 */
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     *
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     *
     * Learn more: https://pris.ly/d/driver-adapters
     *
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     *
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
/**
 * Options passed to the `PrismaClient` constructor.
 *
 * A driver adapter (or, alternatively, a Prisma Accelerate URL) is **required**. See {@link PrismaClientOptionsWithAdapter} and {@link PrismaClientOptionsWithAccelerateUrl} for the two variants. All other properties live in {@link PrismaClientBaseOptions} and are optional.
 *
 * Learn more about driver adapters: https://pris.ly/d/driver-adapters
 */
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    workspace?: Prisma.WorkspaceOmit;
    businessSettings?: Prisma.BusinessSettingsOmit;
    fixedCosts?: Prisma.FixedCostsOmit;
    fixedCostExtra?: Prisma.FixedCostExtraOmit;
    ingredient?: Prisma.IngredientOmit;
    offer?: Prisma.OfferOmit;
    offerComponent?: Prisma.OfferComponentOmit;
    salesChannel?: Prisma.SalesChannelOmit;
    channelFee?: Prisma.ChannelFeeOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
