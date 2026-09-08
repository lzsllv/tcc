import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
/**
 * Model Offer
 *
 */
export type OfferModel = runtime.Types.Result.DefaultSelection<Prisma.$OfferPayload>;
export type AggregateOffer = {
    _count: OfferCountAggregateOutputType | null;
    _avg: OfferAvgAggregateOutputType | null;
    _sum: OfferSumAggregateOutputType | null;
    _min: OfferMinAggregateOutputType | null;
    _max: OfferMaxAggregateOutputType | null;
};
export type OfferAvgAggregateOutputType = {
    batchYield: runtime.Decimal | null;
    batchTimeMinutes: runtime.Decimal | null;
    expectedMonthlySales: runtime.Decimal | null;
    desiredMarginBps: number | null;
};
export type OfferSumAggregateOutputType = {
    batchYield: runtime.Decimal | null;
    batchTimeMinutes: runtime.Decimal | null;
    expectedMonthlySales: runtime.Decimal | null;
    desiredMarginBps: number | null;
};
export type OfferMinAggregateOutputType = {
    workspaceId: string | null;
    id: string | null;
    kind: $Enums.OfferKind | null;
    name: string | null;
    category: string | null;
    active: boolean | null;
    batchYield: runtime.Decimal | null;
    batchTimeMinutes: runtime.Decimal | null;
    expectedMonthlySales: runtime.Decimal | null;
    desiredMarginBps: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OfferMaxAggregateOutputType = {
    workspaceId: string | null;
    id: string | null;
    kind: $Enums.OfferKind | null;
    name: string | null;
    category: string | null;
    active: boolean | null;
    batchYield: runtime.Decimal | null;
    batchTimeMinutes: runtime.Decimal | null;
    expectedMonthlySales: runtime.Decimal | null;
    desiredMarginBps: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OfferCountAggregateOutputType = {
    workspaceId: number;
    id: number;
    kind: number;
    name: number;
    category: number;
    active: number;
    batchYield: number;
    batchTimeMinutes: number;
    expectedMonthlySales: number;
    desiredMarginBps: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OfferAvgAggregateInputType = {
    batchYield?: true;
    batchTimeMinutes?: true;
    expectedMonthlySales?: true;
    desiredMarginBps?: true;
};
export type OfferSumAggregateInputType = {
    batchYield?: true;
    batchTimeMinutes?: true;
    expectedMonthlySales?: true;
    desiredMarginBps?: true;
};
export type OfferMinAggregateInputType = {
    workspaceId?: true;
    id?: true;
    kind?: true;
    name?: true;
    category?: true;
    active?: true;
    batchYield?: true;
    batchTimeMinutes?: true;
    expectedMonthlySales?: true;
    desiredMarginBps?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OfferMaxAggregateInputType = {
    workspaceId?: true;
    id?: true;
    kind?: true;
    name?: true;
    category?: true;
    active?: true;
    batchYield?: true;
    batchTimeMinutes?: true;
    expectedMonthlySales?: true;
    desiredMarginBps?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OfferCountAggregateInputType = {
    workspaceId?: true;
    id?: true;
    kind?: true;
    name?: true;
    category?: true;
    active?: true;
    batchYield?: true;
    batchTimeMinutes?: true;
    expectedMonthlySales?: true;
    desiredMarginBps?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OfferAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Offer to aggregate.
     */
    where?: Prisma.OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: Prisma.OfferOrderByWithRelationInput | Prisma.OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Offers
    **/
    _count?: true | OfferCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OfferAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OfferSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OfferMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OfferMaxAggregateInputType;
};
export type GetOfferAggregateType<T extends OfferAggregateArgs> = {
    [P in keyof T & keyof AggregateOffer]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOffer[P]> : Prisma.GetScalarType<T[P], AggregateOffer[P]>;
};
export type OfferGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OfferWhereInput;
    orderBy?: Prisma.OfferOrderByWithAggregationInput | Prisma.OfferOrderByWithAggregationInput[];
    by: Prisma.OfferScalarFieldEnum[] | Prisma.OfferScalarFieldEnum;
    having?: Prisma.OfferScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OfferCountAggregateInputType | true;
    _avg?: OfferAvgAggregateInputType;
    _sum?: OfferSumAggregateInputType;
    _min?: OfferMinAggregateInputType;
    _max?: OfferMaxAggregateInputType;
};
export type OfferGroupByOutputType = {
    workspaceId: string;
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active: boolean;
    batchYield: runtime.Decimal;
    batchTimeMinutes: runtime.Decimal;
    expectedMonthlySales: runtime.Decimal;
    desiredMarginBps: number | null;
    createdAt: Date;
    updatedAt: Date;
    _count: OfferCountAggregateOutputType | null;
    _avg: OfferAvgAggregateOutputType | null;
    _sum: OfferSumAggregateOutputType | null;
    _min: OfferMinAggregateOutputType | null;
    _max: OfferMaxAggregateOutputType | null;
};
export type GetOfferGroupByPayload<T extends OfferGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OfferGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OfferGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OfferGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OfferGroupByOutputType[P]>;
}>>;
export type OfferWhereInput = {
    AND?: Prisma.OfferWhereInput | Prisma.OfferWhereInput[];
    OR?: Prisma.OfferWhereInput[];
    NOT?: Prisma.OfferWhereInput | Prisma.OfferWhereInput[];
    workspaceId?: Prisma.UuidFilter<"Offer"> | string;
    id?: Prisma.StringFilter<"Offer"> | string;
    kind?: Prisma.EnumOfferKindFilter<"Offer"> | $Enums.OfferKind;
    name?: Prisma.StringFilter<"Offer"> | string;
    category?: Prisma.StringFilter<"Offer"> | string;
    active?: Prisma.BoolFilter<"Offer"> | boolean;
    batchYield?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.IntNullableFilter<"Offer"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Offer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Offer"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    components?: Prisma.OfferComponentListRelationFilter;
};
export type OfferOrderByWithRelationInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    components?: Prisma.OfferComponentOrderByRelationAggregateInput;
};
export type OfferWhereUniqueInput = Prisma.AtLeast<{
    workspaceId_id?: Prisma.OfferWorkspaceIdIdCompoundUniqueInput;
    AND?: Prisma.OfferWhereInput | Prisma.OfferWhereInput[];
    OR?: Prisma.OfferWhereInput[];
    NOT?: Prisma.OfferWhereInput | Prisma.OfferWhereInput[];
    workspaceId?: Prisma.UuidFilter<"Offer"> | string;
    id?: Prisma.StringFilter<"Offer"> | string;
    kind?: Prisma.EnumOfferKindFilter<"Offer"> | $Enums.OfferKind;
    name?: Prisma.StringFilter<"Offer"> | string;
    category?: Prisma.StringFilter<"Offer"> | string;
    active?: Prisma.BoolFilter<"Offer"> | boolean;
    batchYield?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.IntNullableFilter<"Offer"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Offer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Offer"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    components?: Prisma.OfferComponentListRelationFilter;
}, "workspaceId_id">;
export type OfferOrderByWithAggregationInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OfferCountOrderByAggregateInput;
    _avg?: Prisma.OfferAvgOrderByAggregateInput;
    _max?: Prisma.OfferMaxOrderByAggregateInput;
    _min?: Prisma.OfferMinOrderByAggregateInput;
    _sum?: Prisma.OfferSumOrderByAggregateInput;
};
export type OfferScalarWhereWithAggregatesInput = {
    AND?: Prisma.OfferScalarWhereWithAggregatesInput | Prisma.OfferScalarWhereWithAggregatesInput[];
    OR?: Prisma.OfferScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OfferScalarWhereWithAggregatesInput | Prisma.OfferScalarWhereWithAggregatesInput[];
    workspaceId?: Prisma.UuidWithAggregatesFilter<"Offer"> | string;
    id?: Prisma.StringWithAggregatesFilter<"Offer"> | string;
    kind?: Prisma.EnumOfferKindWithAggregatesFilter<"Offer"> | $Enums.OfferKind;
    name?: Prisma.StringWithAggregatesFilter<"Offer"> | string;
    category?: Prisma.StringWithAggregatesFilter<"Offer"> | string;
    active?: Prisma.BoolWithAggregatesFilter<"Offer"> | boolean;
    batchYield?: Prisma.DecimalWithAggregatesFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalWithAggregatesFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalWithAggregatesFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.IntNullableWithAggregatesFilter<"Offer"> | number | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Offer"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Offer"> | Date | string;
};
export type OfferCreateInput = {
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutOffersInput;
    components?: Prisma.OfferComponentCreateNestedManyWithoutOfferInput;
};
export type OfferUncheckedCreateInput = {
    workspaceId: string;
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    components?: Prisma.OfferComponentUncheckedCreateNestedManyWithoutOfferInput;
};
export type OfferUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutOffersNestedInput;
    components?: Prisma.OfferComponentUpdateManyWithoutOfferNestedInput;
};
export type OfferUncheckedUpdateInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    components?: Prisma.OfferComponentUncheckedUpdateManyWithoutOfferNestedInput;
};
export type OfferCreateManyInput = {
    workspaceId: string;
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};
export type OfferUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OfferUncheckedUpdateManyInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OfferListRelationFilter = {
    every?: Prisma.OfferWhereInput;
    some?: Prisma.OfferWhereInput;
    none?: Prisma.OfferWhereInput;
};
export type OfferOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OfferWorkspaceIdIdCompoundUniqueInput = {
    workspaceId: string;
    id: string;
};
export type OfferCountOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OfferAvgOrderByAggregateInput = {
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrder;
};
export type OfferMaxOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OfferMinOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OfferSumOrderByAggregateInput = {
    batchYield?: Prisma.SortOrder;
    batchTimeMinutes?: Prisma.SortOrder;
    expectedMonthlySales?: Prisma.SortOrder;
    desiredMarginBps?: Prisma.SortOrder;
};
export type OfferScalarRelationFilter = {
    is?: Prisma.OfferWhereInput;
    isNot?: Prisma.OfferWhereInput;
};
export type OfferCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.OfferCreateWithoutWorkspaceInput, Prisma.OfferUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferCreateWithoutWorkspaceInput[] | Prisma.OfferUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferCreateOrConnectWithoutWorkspaceInput | Prisma.OfferCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.OfferCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
};
export type OfferUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.OfferCreateWithoutWorkspaceInput, Prisma.OfferUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferCreateWithoutWorkspaceInput[] | Prisma.OfferUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferCreateOrConnectWithoutWorkspaceInput | Prisma.OfferCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.OfferCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
};
export type OfferUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.OfferCreateWithoutWorkspaceInput, Prisma.OfferUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferCreateWithoutWorkspaceInput[] | Prisma.OfferUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferCreateOrConnectWithoutWorkspaceInput | Prisma.OfferCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.OfferUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.OfferCreateManyWorkspaceInputEnvelope;
    set?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    disconnect?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    delete?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    connect?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    update?: Prisma.OfferUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.OfferUpdateManyWithWhereWithoutWorkspaceInput | Prisma.OfferUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.OfferScalarWhereInput | Prisma.OfferScalarWhereInput[];
};
export type OfferUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.OfferCreateWithoutWorkspaceInput, Prisma.OfferUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferCreateWithoutWorkspaceInput[] | Prisma.OfferUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferCreateOrConnectWithoutWorkspaceInput | Prisma.OfferCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.OfferUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.OfferCreateManyWorkspaceInputEnvelope;
    set?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    disconnect?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    delete?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    connect?: Prisma.OfferWhereUniqueInput | Prisma.OfferWhereUniqueInput[];
    update?: Prisma.OfferUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.OfferUpdateManyWithWhereWithoutWorkspaceInput | Prisma.OfferUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.OfferScalarWhereInput | Prisma.OfferScalarWhereInput[];
};
export type EnumOfferKindFieldUpdateOperationsInput = {
    set?: $Enums.OfferKind;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type OfferCreateNestedOneWithoutComponentsInput = {
    create?: Prisma.XOR<Prisma.OfferCreateWithoutComponentsInput, Prisma.OfferUncheckedCreateWithoutComponentsInput>;
    connectOrCreate?: Prisma.OfferCreateOrConnectWithoutComponentsInput;
    connect?: Prisma.OfferWhereUniqueInput;
};
export type OfferUpdateOneRequiredWithoutComponentsNestedInput = {
    create?: Prisma.XOR<Prisma.OfferCreateWithoutComponentsInput, Prisma.OfferUncheckedCreateWithoutComponentsInput>;
    connectOrCreate?: Prisma.OfferCreateOrConnectWithoutComponentsInput;
    upsert?: Prisma.OfferUpsertWithoutComponentsInput;
    connect?: Prisma.OfferWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.OfferUpdateToOneWithWhereWithoutComponentsInput, Prisma.OfferUpdateWithoutComponentsInput>, Prisma.OfferUncheckedUpdateWithoutComponentsInput>;
};
export type OfferCreateWithoutWorkspaceInput = {
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    components?: Prisma.OfferComponentCreateNestedManyWithoutOfferInput;
};
export type OfferUncheckedCreateWithoutWorkspaceInput = {
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    components?: Prisma.OfferComponentUncheckedCreateNestedManyWithoutOfferInput;
};
export type OfferCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.OfferWhereUniqueInput;
    create: Prisma.XOR<Prisma.OfferCreateWithoutWorkspaceInput, Prisma.OfferUncheckedCreateWithoutWorkspaceInput>;
};
export type OfferCreateManyWorkspaceInputEnvelope = {
    data: Prisma.OfferCreateManyWorkspaceInput | Prisma.OfferCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type OfferUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.OfferWhereUniqueInput;
    update: Prisma.XOR<Prisma.OfferUpdateWithoutWorkspaceInput, Prisma.OfferUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.OfferCreateWithoutWorkspaceInput, Prisma.OfferUncheckedCreateWithoutWorkspaceInput>;
};
export type OfferUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.OfferWhereUniqueInput;
    data: Prisma.XOR<Prisma.OfferUpdateWithoutWorkspaceInput, Prisma.OfferUncheckedUpdateWithoutWorkspaceInput>;
};
export type OfferUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.OfferScalarWhereInput;
    data: Prisma.XOR<Prisma.OfferUpdateManyMutationInput, Prisma.OfferUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type OfferScalarWhereInput = {
    AND?: Prisma.OfferScalarWhereInput | Prisma.OfferScalarWhereInput[];
    OR?: Prisma.OfferScalarWhereInput[];
    NOT?: Prisma.OfferScalarWhereInput | Prisma.OfferScalarWhereInput[];
    workspaceId?: Prisma.UuidFilter<"Offer"> | string;
    id?: Prisma.StringFilter<"Offer"> | string;
    kind?: Prisma.EnumOfferKindFilter<"Offer"> | $Enums.OfferKind;
    name?: Prisma.StringFilter<"Offer"> | string;
    category?: Prisma.StringFilter<"Offer"> | string;
    active?: Prisma.BoolFilter<"Offer"> | boolean;
    batchYield?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFilter<"Offer"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.IntNullableFilter<"Offer"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Offer"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Offer"> | Date | string;
};
export type OfferCreateWithoutComponentsInput = {
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutOffersInput;
};
export type OfferUncheckedCreateWithoutComponentsInput = {
    workspaceId: string;
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};
export type OfferCreateOrConnectWithoutComponentsInput = {
    where: Prisma.OfferWhereUniqueInput;
    create: Prisma.XOR<Prisma.OfferCreateWithoutComponentsInput, Prisma.OfferUncheckedCreateWithoutComponentsInput>;
};
export type OfferUpsertWithoutComponentsInput = {
    update: Prisma.XOR<Prisma.OfferUpdateWithoutComponentsInput, Prisma.OfferUncheckedUpdateWithoutComponentsInput>;
    create: Prisma.XOR<Prisma.OfferCreateWithoutComponentsInput, Prisma.OfferUncheckedCreateWithoutComponentsInput>;
    where?: Prisma.OfferWhereInput;
};
export type OfferUpdateToOneWithWhereWithoutComponentsInput = {
    where?: Prisma.OfferWhereInput;
    data: Prisma.XOR<Prisma.OfferUpdateWithoutComponentsInput, Prisma.OfferUncheckedUpdateWithoutComponentsInput>;
};
export type OfferUpdateWithoutComponentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutOffersNestedInput;
};
export type OfferUncheckedUpdateWithoutComponentsInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OfferCreateManyWorkspaceInput = {
    id: string;
    kind: $Enums.OfferKind;
    name: string;
    category: string;
    active?: boolean;
    batchYield: runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes: runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales: runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: number | null;
    createdAt: Date | string;
    updatedAt: Date | string;
};
export type OfferUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    components?: Prisma.OfferComponentUpdateManyWithoutOfferNestedInput;
};
export type OfferUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    components?: Prisma.OfferComponentUncheckedUpdateManyWithoutOfferNestedInput;
};
export type OfferUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.EnumOfferKindFieldUpdateOperationsInput | $Enums.OfferKind;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    batchYield?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    batchTimeMinutes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    expectedMonthlySales?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    desiredMarginBps?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type OfferCountOutputType
 */
export type OfferCountOutputType = {
    components: number;
};
export type OfferCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    components?: boolean | OfferCountOutputTypeCountComponentsArgs;
};
/**
 * OfferCountOutputType without action
 */
export type OfferCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfferCountOutputType
     */
    select?: Prisma.OfferCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * OfferCountOutputType without action
 */
export type OfferCountOutputTypeCountComponentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OfferComponentWhereInput;
};
export type OfferSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    kind?: boolean;
    name?: boolean;
    category?: boolean;
    active?: boolean;
    batchYield?: boolean;
    batchTimeMinutes?: boolean;
    expectedMonthlySales?: boolean;
    desiredMarginBps?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    components?: boolean | Prisma.Offer$componentsArgs<ExtArgs>;
    _count?: boolean | Prisma.OfferCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["offer"]>;
export type OfferSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    kind?: boolean;
    name?: boolean;
    category?: boolean;
    active?: boolean;
    batchYield?: boolean;
    batchTimeMinutes?: boolean;
    expectedMonthlySales?: boolean;
    desiredMarginBps?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["offer"]>;
export type OfferSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    kind?: boolean;
    name?: boolean;
    category?: boolean;
    active?: boolean;
    batchYield?: boolean;
    batchTimeMinutes?: boolean;
    expectedMonthlySales?: boolean;
    desiredMarginBps?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["offer"]>;
export type OfferSelectScalar = {
    workspaceId?: boolean;
    id?: boolean;
    kind?: boolean;
    name?: boolean;
    category?: boolean;
    active?: boolean;
    batchYield?: boolean;
    batchTimeMinutes?: boolean;
    expectedMonthlySales?: boolean;
    desiredMarginBps?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OfferOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"workspaceId" | "id" | "kind" | "name" | "category" | "active" | "batchYield" | "batchTimeMinutes" | "expectedMonthlySales" | "desiredMarginBps" | "createdAt" | "updatedAt", ExtArgs["result"]["offer"]>;
export type OfferInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    components?: boolean | Prisma.Offer$componentsArgs<ExtArgs>;
    _count?: boolean | Prisma.OfferCountOutputTypeDefaultArgs<ExtArgs>;
};
export type OfferIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type OfferIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type $OfferPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Offer";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        components: Prisma.$OfferComponentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        workspaceId: string;
        id: string;
        kind: $Enums.OfferKind;
        name: string;
        category: string;
        active: boolean;
        batchYield: runtime.Decimal;
        batchTimeMinutes: runtime.Decimal;
        expectedMonthlySales: runtime.Decimal;
        desiredMarginBps: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["offer"]>;
    composites: {};
};
export type OfferGetPayload<S extends boolean | null | undefined | OfferDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OfferPayload, S>;
export type OfferCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OfferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OfferCountAggregateInputType | true;
};
export interface OfferDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Offer'];
        meta: {
            name: 'Offer';
        };
    };
    /**
     * Find zero or one Offer that matches the filter.
     * @param {OfferFindUniqueArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OfferFindUniqueArgs>(args: Prisma.SelectSubset<T, OfferFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Offer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OfferFindUniqueOrThrowArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OfferFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OfferFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Offer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferFindFirstArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OfferFindFirstArgs>(args?: Prisma.SelectSubset<T, OfferFindFirstArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Offer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferFindFirstOrThrowArgs} args - Arguments to find a Offer
     * @example
     * // Get one Offer
     * const offer = await prisma.offer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OfferFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OfferFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Offers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Offers
     * const offers = await prisma.offer.findMany()
     *
     * // Get first 10 Offers
     * const offers = await prisma.offer.findMany({ take: 10 })
     *
     * // Only select the `workspaceId`
     * const offerWithWorkspaceIdOnly = await prisma.offer.findMany({ select: { workspaceId: true } })
     *
     */
    findMany<T extends OfferFindManyArgs>(args?: Prisma.SelectSubset<T, OfferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Offer.
     * @param {OfferCreateArgs} args - Arguments to create a Offer.
     * @example
     * // Create one Offer
     * const Offer = await prisma.offer.create({
     *   data: {
     *     // ... data to create a Offer
     *   }
     * })
     *
     */
    create<T extends OfferCreateArgs>(args: Prisma.SelectSubset<T, OfferCreateArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Offers.
     * @param {OfferCreateManyArgs} args - Arguments to create many Offers.
     * @example
     * // Create many Offers
     * const offer = await prisma.offer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OfferCreateManyArgs>(args?: Prisma.SelectSubset<T, OfferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Offers and returns the data saved in the database.
     * @param {OfferCreateManyAndReturnArgs} args - Arguments to create many Offers.
     * @example
     * // Create many Offers
     * const offer = await prisma.offer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Offers and only return the `workspaceId`
     * const offerWithWorkspaceIdOnly = await prisma.offer.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OfferCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OfferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Offer.
     * @param {OfferDeleteArgs} args - Arguments to delete one Offer.
     * @example
     * // Delete one Offer
     * const Offer = await prisma.offer.delete({
     *   where: {
     *     // ... filter to delete one Offer
     *   }
     * })
     *
     */
    delete<T extends OfferDeleteArgs>(args: Prisma.SelectSubset<T, OfferDeleteArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Offer.
     * @param {OfferUpdateArgs} args - Arguments to update one Offer.
     * @example
     * // Update one Offer
     * const offer = await prisma.offer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OfferUpdateArgs>(args: Prisma.SelectSubset<T, OfferUpdateArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Offers.
     * @param {OfferDeleteManyArgs} args - Arguments to filter Offers to delete.
     * @example
     * // Delete a few Offers
     * const { count } = await prisma.offer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OfferDeleteManyArgs>(args?: Prisma.SelectSubset<T, OfferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Offers
     * const offer = await prisma.offer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OfferUpdateManyArgs>(args: Prisma.SelectSubset<T, OfferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Offers and returns the data updated in the database.
     * @param {OfferUpdateManyAndReturnArgs} args - Arguments to update many Offers.
     * @example
     * // Update many Offers
     * const offer = await prisma.offer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Offers and only return the `workspaceId`
     * const offerWithWorkspaceIdOnly = await prisma.offer.updateManyAndReturn({
     *   select: { workspaceId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends OfferUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OfferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Offer.
     * @param {OfferUpsertArgs} args - Arguments to update or create a Offer.
     * @example
     * // Update or create a Offer
     * const offer = await prisma.offer.upsert({
     *   create: {
     *     // ... data to create a Offer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Offer we want to update
     *   }
     * })
     */
    upsert<T extends OfferUpsertArgs>(args: Prisma.SelectSubset<T, OfferUpsertArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Offers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferCountArgs} args - Arguments to filter Offers to count.
     * @example
     * // Count the number of Offers
     * const count = await prisma.offer.count({
     *   where: {
     *     // ... the filter for the Offers we want to count
     *   }
     * })
    **/
    count<T extends OfferCountArgs>(args?: Prisma.Subset<T, OfferCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OfferCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Offer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OfferAggregateArgs>(args: Prisma.Subset<T, OfferAggregateArgs>): Prisma.PrismaPromise<GetOfferAggregateType<T>>;
    /**
     * Group by Offer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends OfferGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OfferGroupByArgs['orderBy'];
    } : {
        orderBy?: OfferGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OfferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOfferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Offer model
     */
    readonly fields: OfferFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Offer.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OfferClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    components<T extends Prisma.Offer$componentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Offer$componentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Offer model
 */
export interface OfferFieldRefs {
    readonly workspaceId: Prisma.FieldRef<"Offer", 'String'>;
    readonly id: Prisma.FieldRef<"Offer", 'String'>;
    readonly kind: Prisma.FieldRef<"Offer", 'OfferKind'>;
    readonly name: Prisma.FieldRef<"Offer", 'String'>;
    readonly category: Prisma.FieldRef<"Offer", 'String'>;
    readonly active: Prisma.FieldRef<"Offer", 'Boolean'>;
    readonly batchYield: Prisma.FieldRef<"Offer", 'Decimal'>;
    readonly batchTimeMinutes: Prisma.FieldRef<"Offer", 'Decimal'>;
    readonly expectedMonthlySales: Prisma.FieldRef<"Offer", 'Decimal'>;
    readonly desiredMarginBps: Prisma.FieldRef<"Offer", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Offer", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Offer", 'DateTime'>;
}
/**
 * Offer findUnique
 */
export type OfferFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where: Prisma.OfferWhereUniqueInput;
};
/**
 * Offer findUniqueOrThrow
 */
export type OfferFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where: Prisma.OfferWhereUniqueInput;
};
/**
 * Offer findFirst
 */
export type OfferFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where?: Prisma.OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: Prisma.OfferOrderByWithRelationInput | Prisma.OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Offers.
     */
    cursor?: Prisma.OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Offers.
     */
    distinct?: Prisma.OfferScalarFieldEnum | Prisma.OfferScalarFieldEnum[];
};
/**
 * Offer findFirstOrThrow
 */
export type OfferFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offer to fetch.
     */
    where?: Prisma.OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: Prisma.OfferOrderByWithRelationInput | Prisma.OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Offers.
     */
    cursor?: Prisma.OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Offers.
     */
    distinct?: Prisma.OfferScalarFieldEnum | Prisma.OfferScalarFieldEnum[];
};
/**
 * Offer findMany
 */
export type OfferFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * Filter, which Offers to fetch.
     */
    where?: Prisma.OfferWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Offers to fetch.
     */
    orderBy?: Prisma.OfferOrderByWithRelationInput | Prisma.OfferOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Offers.
     */
    cursor?: Prisma.OfferWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Offers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Offers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Offers.
     */
    distinct?: Prisma.OfferScalarFieldEnum | Prisma.OfferScalarFieldEnum[];
};
/**
 * Offer create
 */
export type OfferCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * The data needed to create a Offer.
     */
    data: Prisma.XOR<Prisma.OfferCreateInput, Prisma.OfferUncheckedCreateInput>;
};
/**
 * Offer createMany
 */
export type OfferCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Offers.
     */
    data: Prisma.OfferCreateManyInput | Prisma.OfferCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Offer createManyAndReturn
 */
export type OfferCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * The data used to create many Offers.
     */
    data: Prisma.OfferCreateManyInput | Prisma.OfferCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Offer update
 */
export type OfferUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * The data needed to update a Offer.
     */
    data: Prisma.XOR<Prisma.OfferUpdateInput, Prisma.OfferUncheckedUpdateInput>;
    /**
     * Choose, which Offer to update.
     */
    where: Prisma.OfferWhereUniqueInput;
};
/**
 * Offer updateMany
 */
export type OfferUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Offers.
     */
    data: Prisma.XOR<Prisma.OfferUpdateManyMutationInput, Prisma.OfferUncheckedUpdateManyInput>;
    /**
     * Filter which Offers to update
     */
    where?: Prisma.OfferWhereInput;
    /**
     * Limit how many Offers to update.
     */
    limit?: number;
};
/**
 * Offer updateManyAndReturn
 */
export type OfferUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * The data used to update Offers.
     */
    data: Prisma.XOR<Prisma.OfferUpdateManyMutationInput, Prisma.OfferUncheckedUpdateManyInput>;
    /**
     * Filter which Offers to update
     */
    where?: Prisma.OfferWhereInput;
    /**
     * Limit how many Offers to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Offer upsert
 */
export type OfferUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * The filter to search for the Offer to update in case it exists.
     */
    where: Prisma.OfferWhereUniqueInput;
    /**
     * In case the Offer found by the `where` argument doesn't exist, create a new Offer with this data.
     */
    create: Prisma.XOR<Prisma.OfferCreateInput, Prisma.OfferUncheckedCreateInput>;
    /**
     * In case the Offer was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OfferUpdateInput, Prisma.OfferUncheckedUpdateInput>;
};
/**
 * Offer delete
 */
export type OfferDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
    /**
     * Filter which Offer to delete.
     */
    where: Prisma.OfferWhereUniqueInput;
};
/**
 * Offer deleteMany
 */
export type OfferDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Offers to delete
     */
    where?: Prisma.OfferWhereInput;
    /**
     * Limit how many Offers to delete.
     */
    limit?: number;
};
/**
 * Offer.components
 */
export type Offer$componentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfferComponent
     */
    select?: Prisma.OfferComponentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OfferComponent
     */
    omit?: Prisma.OfferComponentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferComponentInclude<ExtArgs> | null;
    where?: Prisma.OfferComponentWhereInput;
    orderBy?: Prisma.OfferComponentOrderByWithRelationInput | Prisma.OfferComponentOrderByWithRelationInput[];
    cursor?: Prisma.OfferComponentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OfferComponentScalarFieldEnum | Prisma.OfferComponentScalarFieldEnum[];
};
/**
 * Offer without action
 */
export type OfferDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offer
     */
    select?: Prisma.OfferSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Offer
     */
    omit?: Prisma.OfferOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferInclude<ExtArgs> | null;
};
