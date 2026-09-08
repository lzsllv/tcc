import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
/**
 * Model FixedCostExtra
 *
 */
export type FixedCostExtraModel = runtime.Types.Result.DefaultSelection<Prisma.$FixedCostExtraPayload>;
export type AggregateFixedCostExtra = {
    _count: FixedCostExtraCountAggregateOutputType | null;
    _avg: FixedCostExtraAvgAggregateOutputType | null;
    _sum: FixedCostExtraSumAggregateOutputType | null;
    _min: FixedCostExtraMinAggregateOutputType | null;
    _max: FixedCostExtraMaxAggregateOutputType | null;
};
export type FixedCostExtraAvgAggregateOutputType = {
    valueCents: number | null;
    position: number | null;
};
export type FixedCostExtraSumAggregateOutputType = {
    valueCents: bigint | null;
    position: number | null;
};
export type FixedCostExtraMinAggregateOutputType = {
    workspaceId: string | null;
    id: string | null;
    name: string | null;
    valueCents: bigint | null;
    position: number | null;
};
export type FixedCostExtraMaxAggregateOutputType = {
    workspaceId: string | null;
    id: string | null;
    name: string | null;
    valueCents: bigint | null;
    position: number | null;
};
export type FixedCostExtraCountAggregateOutputType = {
    workspaceId: number;
    id: number;
    name: number;
    valueCents: number;
    position: number;
    _all: number;
};
export type FixedCostExtraAvgAggregateInputType = {
    valueCents?: true;
    position?: true;
};
export type FixedCostExtraSumAggregateInputType = {
    valueCents?: true;
    position?: true;
};
export type FixedCostExtraMinAggregateInputType = {
    workspaceId?: true;
    id?: true;
    name?: true;
    valueCents?: true;
    position?: true;
};
export type FixedCostExtraMaxAggregateInputType = {
    workspaceId?: true;
    id?: true;
    name?: true;
    valueCents?: true;
    position?: true;
};
export type FixedCostExtraCountAggregateInputType = {
    workspaceId?: true;
    id?: true;
    name?: true;
    valueCents?: true;
    position?: true;
    _all?: true;
};
export type FixedCostExtraAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FixedCostExtra to aggregate.
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FixedCostExtras to fetch.
     */
    orderBy?: Prisma.FixedCostExtraOrderByWithRelationInput | Prisma.FixedCostExtraOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.FixedCostExtraWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FixedCostExtras from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FixedCostExtras.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FixedCostExtras
    **/
    _count?: true | FixedCostExtraCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: FixedCostExtraAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: FixedCostExtraSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: FixedCostExtraMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: FixedCostExtraMaxAggregateInputType;
};
export type GetFixedCostExtraAggregateType<T extends FixedCostExtraAggregateArgs> = {
    [P in keyof T & keyof AggregateFixedCostExtra]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFixedCostExtra[P]> : Prisma.GetScalarType<T[P], AggregateFixedCostExtra[P]>;
};
export type FixedCostExtraGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FixedCostExtraWhereInput;
    orderBy?: Prisma.FixedCostExtraOrderByWithAggregationInput | Prisma.FixedCostExtraOrderByWithAggregationInput[];
    by: Prisma.FixedCostExtraScalarFieldEnum[] | Prisma.FixedCostExtraScalarFieldEnum;
    having?: Prisma.FixedCostExtraScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FixedCostExtraCountAggregateInputType | true;
    _avg?: FixedCostExtraAvgAggregateInputType;
    _sum?: FixedCostExtraSumAggregateInputType;
    _min?: FixedCostExtraMinAggregateInputType;
    _max?: FixedCostExtraMaxAggregateInputType;
};
export type FixedCostExtraGroupByOutputType = {
    workspaceId: string;
    id: string;
    name: string;
    valueCents: bigint;
    position: number;
    _count: FixedCostExtraCountAggregateOutputType | null;
    _avg: FixedCostExtraAvgAggregateOutputType | null;
    _sum: FixedCostExtraSumAggregateOutputType | null;
    _min: FixedCostExtraMinAggregateOutputType | null;
    _max: FixedCostExtraMaxAggregateOutputType | null;
};
export type GetFixedCostExtraGroupByPayload<T extends FixedCostExtraGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FixedCostExtraGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FixedCostExtraGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FixedCostExtraGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FixedCostExtraGroupByOutputType[P]>;
}>>;
export type FixedCostExtraWhereInput = {
    AND?: Prisma.FixedCostExtraWhereInput | Prisma.FixedCostExtraWhereInput[];
    OR?: Prisma.FixedCostExtraWhereInput[];
    NOT?: Prisma.FixedCostExtraWhereInput | Prisma.FixedCostExtraWhereInput[];
    workspaceId?: Prisma.UuidFilter<"FixedCostExtra"> | string;
    id?: Prisma.StringFilter<"FixedCostExtra"> | string;
    name?: Prisma.StringFilter<"FixedCostExtra"> | string;
    valueCents?: Prisma.BigIntFilter<"FixedCostExtra"> | bigint | number;
    position?: Prisma.IntFilter<"FixedCostExtra"> | number;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
};
export type FixedCostExtraOrderByWithRelationInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
};
export type FixedCostExtraWhereUniqueInput = Prisma.AtLeast<{
    workspaceId_id?: Prisma.FixedCostExtraWorkspaceIdIdCompoundUniqueInput;
    AND?: Prisma.FixedCostExtraWhereInput | Prisma.FixedCostExtraWhereInput[];
    OR?: Prisma.FixedCostExtraWhereInput[];
    NOT?: Prisma.FixedCostExtraWhereInput | Prisma.FixedCostExtraWhereInput[];
    workspaceId?: Prisma.UuidFilter<"FixedCostExtra"> | string;
    id?: Prisma.StringFilter<"FixedCostExtra"> | string;
    name?: Prisma.StringFilter<"FixedCostExtra"> | string;
    valueCents?: Prisma.BigIntFilter<"FixedCostExtra"> | bigint | number;
    position?: Prisma.IntFilter<"FixedCostExtra"> | number;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
}, "workspaceId_id">;
export type FixedCostExtraOrderByWithAggregationInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    _count?: Prisma.FixedCostExtraCountOrderByAggregateInput;
    _avg?: Prisma.FixedCostExtraAvgOrderByAggregateInput;
    _max?: Prisma.FixedCostExtraMaxOrderByAggregateInput;
    _min?: Prisma.FixedCostExtraMinOrderByAggregateInput;
    _sum?: Prisma.FixedCostExtraSumOrderByAggregateInput;
};
export type FixedCostExtraScalarWhereWithAggregatesInput = {
    AND?: Prisma.FixedCostExtraScalarWhereWithAggregatesInput | Prisma.FixedCostExtraScalarWhereWithAggregatesInput[];
    OR?: Prisma.FixedCostExtraScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FixedCostExtraScalarWhereWithAggregatesInput | Prisma.FixedCostExtraScalarWhereWithAggregatesInput[];
    workspaceId?: Prisma.UuidWithAggregatesFilter<"FixedCostExtra"> | string;
    id?: Prisma.StringWithAggregatesFilter<"FixedCostExtra"> | string;
    name?: Prisma.StringWithAggregatesFilter<"FixedCostExtra"> | string;
    valueCents?: Prisma.BigIntWithAggregatesFilter<"FixedCostExtra"> | bigint | number;
    position?: Prisma.IntWithAggregatesFilter<"FixedCostExtra"> | number;
};
export type FixedCostExtraCreateInput = {
    id: string;
    name: string;
    valueCents: bigint | number;
    position: number;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutFixedCostExtrasInput;
};
export type FixedCostExtraUncheckedCreateInput = {
    workspaceId: string;
    id: string;
    name: string;
    valueCents: bigint | number;
    position: number;
};
export type FixedCostExtraUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutFixedCostExtrasNestedInput;
};
export type FixedCostExtraUncheckedUpdateInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FixedCostExtraCreateManyInput = {
    workspaceId: string;
    id: string;
    name: string;
    valueCents: bigint | number;
    position: number;
};
export type FixedCostExtraUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FixedCostExtraUncheckedUpdateManyInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FixedCostExtraListRelationFilter = {
    every?: Prisma.FixedCostExtraWhereInput;
    some?: Prisma.FixedCostExtraWhereInput;
    none?: Prisma.FixedCostExtraWhereInput;
};
export type FixedCostExtraOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FixedCostExtraWorkspaceIdIdCompoundUniqueInput = {
    workspaceId: string;
    id: string;
};
export type FixedCostExtraCountOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type FixedCostExtraAvgOrderByAggregateInput = {
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type FixedCostExtraMaxOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type FixedCostExtraMinOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type FixedCostExtraSumOrderByAggregateInput = {
    valueCents?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type FixedCostExtraCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.FixedCostExtraCreateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput> | Prisma.FixedCostExtraCreateWithoutWorkspaceInput[] | Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput | Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.FixedCostExtraCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
};
export type FixedCostExtraUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.FixedCostExtraCreateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput> | Prisma.FixedCostExtraCreateWithoutWorkspaceInput[] | Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput | Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.FixedCostExtraCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
};
export type FixedCostExtraUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.FixedCostExtraCreateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput> | Prisma.FixedCostExtraCreateWithoutWorkspaceInput[] | Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput | Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.FixedCostExtraUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.FixedCostExtraUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.FixedCostExtraCreateManyWorkspaceInputEnvelope;
    set?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    disconnect?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    delete?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    connect?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    update?: Prisma.FixedCostExtraUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.FixedCostExtraUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.FixedCostExtraUpdateManyWithWhereWithoutWorkspaceInput | Prisma.FixedCostExtraUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.FixedCostExtraScalarWhereInput | Prisma.FixedCostExtraScalarWhereInput[];
};
export type FixedCostExtraUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.FixedCostExtraCreateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput> | Prisma.FixedCostExtraCreateWithoutWorkspaceInput[] | Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput | Prisma.FixedCostExtraCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.FixedCostExtraUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.FixedCostExtraUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.FixedCostExtraCreateManyWorkspaceInputEnvelope;
    set?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    disconnect?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    delete?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    connect?: Prisma.FixedCostExtraWhereUniqueInput | Prisma.FixedCostExtraWhereUniqueInput[];
    update?: Prisma.FixedCostExtraUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.FixedCostExtraUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.FixedCostExtraUpdateManyWithWhereWithoutWorkspaceInput | Prisma.FixedCostExtraUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.FixedCostExtraScalarWhereInput | Prisma.FixedCostExtraScalarWhereInput[];
};
export type FixedCostExtraCreateWithoutWorkspaceInput = {
    id: string;
    name: string;
    valueCents: bigint | number;
    position: number;
};
export type FixedCostExtraUncheckedCreateWithoutWorkspaceInput = {
    id: string;
    name: string;
    valueCents: bigint | number;
    position: number;
};
export type FixedCostExtraCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.FixedCostExtraWhereUniqueInput;
    create: Prisma.XOR<Prisma.FixedCostExtraCreateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput>;
};
export type FixedCostExtraCreateManyWorkspaceInputEnvelope = {
    data: Prisma.FixedCostExtraCreateManyWorkspaceInput | Prisma.FixedCostExtraCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type FixedCostExtraUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.FixedCostExtraWhereUniqueInput;
    update: Prisma.XOR<Prisma.FixedCostExtraUpdateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.FixedCostExtraCreateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedCreateWithoutWorkspaceInput>;
};
export type FixedCostExtraUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.FixedCostExtraWhereUniqueInput;
    data: Prisma.XOR<Prisma.FixedCostExtraUpdateWithoutWorkspaceInput, Prisma.FixedCostExtraUncheckedUpdateWithoutWorkspaceInput>;
};
export type FixedCostExtraUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.FixedCostExtraScalarWhereInput;
    data: Prisma.XOR<Prisma.FixedCostExtraUpdateManyMutationInput, Prisma.FixedCostExtraUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type FixedCostExtraScalarWhereInput = {
    AND?: Prisma.FixedCostExtraScalarWhereInput | Prisma.FixedCostExtraScalarWhereInput[];
    OR?: Prisma.FixedCostExtraScalarWhereInput[];
    NOT?: Prisma.FixedCostExtraScalarWhereInput | Prisma.FixedCostExtraScalarWhereInput[];
    workspaceId?: Prisma.UuidFilter<"FixedCostExtra"> | string;
    id?: Prisma.StringFilter<"FixedCostExtra"> | string;
    name?: Prisma.StringFilter<"FixedCostExtra"> | string;
    valueCents?: Prisma.BigIntFilter<"FixedCostExtra"> | bigint | number;
    position?: Prisma.IntFilter<"FixedCostExtra"> | number;
};
export type FixedCostExtraCreateManyWorkspaceInput = {
    id: string;
    name: string;
    valueCents: bigint | number;
    position: number;
};
export type FixedCostExtraUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FixedCostExtraUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FixedCostExtraUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    valueCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FixedCostExtraSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    valueCents?: boolean;
    position?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fixedCostExtra"]>;
export type FixedCostExtraSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    valueCents?: boolean;
    position?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fixedCostExtra"]>;
export type FixedCostExtraSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    valueCents?: boolean;
    position?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fixedCostExtra"]>;
export type FixedCostExtraSelectScalar = {
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    valueCents?: boolean;
    position?: boolean;
};
export type FixedCostExtraOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"workspaceId" | "id" | "name" | "valueCents" | "position", ExtArgs["result"]["fixedCostExtra"]>;
export type FixedCostExtraInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type FixedCostExtraIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type FixedCostExtraIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type $FixedCostExtraPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FixedCostExtra";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        workspaceId: string;
        id: string;
        name: string;
        valueCents: bigint;
        position: number;
    }, ExtArgs["result"]["fixedCostExtra"]>;
    composites: {};
};
export type FixedCostExtraGetPayload<S extends boolean | null | undefined | FixedCostExtraDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload, S>;
export type FixedCostExtraCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FixedCostExtraFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FixedCostExtraCountAggregateInputType | true;
};
export interface FixedCostExtraDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FixedCostExtra'];
        meta: {
            name: 'FixedCostExtra';
        };
    };
    /**
     * Find zero or one FixedCostExtra that matches the filter.
     * @param {FixedCostExtraFindUniqueArgs} args - Arguments to find a FixedCostExtra
     * @example
     * // Get one FixedCostExtra
     * const fixedCostExtra = await prisma.fixedCostExtra.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FixedCostExtraFindUniqueArgs>(args: Prisma.SelectSubset<T, FixedCostExtraFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one FixedCostExtra that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FixedCostExtraFindUniqueOrThrowArgs} args - Arguments to find a FixedCostExtra
     * @example
     * // Get one FixedCostExtra
     * const fixedCostExtra = await prisma.fixedCostExtra.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FixedCostExtraFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FixedCostExtraFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FixedCostExtra that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraFindFirstArgs} args - Arguments to find a FixedCostExtra
     * @example
     * // Get one FixedCostExtra
     * const fixedCostExtra = await prisma.fixedCostExtra.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FixedCostExtraFindFirstArgs>(args?: Prisma.SelectSubset<T, FixedCostExtraFindFirstArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FixedCostExtra that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraFindFirstOrThrowArgs} args - Arguments to find a FixedCostExtra
     * @example
     * // Get one FixedCostExtra
     * const fixedCostExtra = await prisma.fixedCostExtra.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FixedCostExtraFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FixedCostExtraFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more FixedCostExtras that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FixedCostExtras
     * const fixedCostExtras = await prisma.fixedCostExtra.findMany()
     *
     * // Get first 10 FixedCostExtras
     * const fixedCostExtras = await prisma.fixedCostExtra.findMany({ take: 10 })
     *
     * // Only select the `workspaceId`
     * const fixedCostExtraWithWorkspaceIdOnly = await prisma.fixedCostExtra.findMany({ select: { workspaceId: true } })
     *
     */
    findMany<T extends FixedCostExtraFindManyArgs>(args?: Prisma.SelectSubset<T, FixedCostExtraFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a FixedCostExtra.
     * @param {FixedCostExtraCreateArgs} args - Arguments to create a FixedCostExtra.
     * @example
     * // Create one FixedCostExtra
     * const FixedCostExtra = await prisma.fixedCostExtra.create({
     *   data: {
     *     // ... data to create a FixedCostExtra
     *   }
     * })
     *
     */
    create<T extends FixedCostExtraCreateArgs>(args: Prisma.SelectSubset<T, FixedCostExtraCreateArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many FixedCostExtras.
     * @param {FixedCostExtraCreateManyArgs} args - Arguments to create many FixedCostExtras.
     * @example
     * // Create many FixedCostExtras
     * const fixedCostExtra = await prisma.fixedCostExtra.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FixedCostExtraCreateManyArgs>(args?: Prisma.SelectSubset<T, FixedCostExtraCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many FixedCostExtras and returns the data saved in the database.
     * @param {FixedCostExtraCreateManyAndReturnArgs} args - Arguments to create many FixedCostExtras.
     * @example
     * // Create many FixedCostExtras
     * const fixedCostExtra = await prisma.fixedCostExtra.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many FixedCostExtras and only return the `workspaceId`
     * const fixedCostExtraWithWorkspaceIdOnly = await prisma.fixedCostExtra.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FixedCostExtraCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FixedCostExtraCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a FixedCostExtra.
     * @param {FixedCostExtraDeleteArgs} args - Arguments to delete one FixedCostExtra.
     * @example
     * // Delete one FixedCostExtra
     * const FixedCostExtra = await prisma.fixedCostExtra.delete({
     *   where: {
     *     // ... filter to delete one FixedCostExtra
     *   }
     * })
     *
     */
    delete<T extends FixedCostExtraDeleteArgs>(args: Prisma.SelectSubset<T, FixedCostExtraDeleteArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one FixedCostExtra.
     * @param {FixedCostExtraUpdateArgs} args - Arguments to update one FixedCostExtra.
     * @example
     * // Update one FixedCostExtra
     * const fixedCostExtra = await prisma.fixedCostExtra.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FixedCostExtraUpdateArgs>(args: Prisma.SelectSubset<T, FixedCostExtraUpdateArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more FixedCostExtras.
     * @param {FixedCostExtraDeleteManyArgs} args - Arguments to filter FixedCostExtras to delete.
     * @example
     * // Delete a few FixedCostExtras
     * const { count } = await prisma.fixedCostExtra.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FixedCostExtraDeleteManyArgs>(args?: Prisma.SelectSubset<T, FixedCostExtraDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FixedCostExtras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FixedCostExtras
     * const fixedCostExtra = await prisma.fixedCostExtra.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FixedCostExtraUpdateManyArgs>(args: Prisma.SelectSubset<T, FixedCostExtraUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FixedCostExtras and returns the data updated in the database.
     * @param {FixedCostExtraUpdateManyAndReturnArgs} args - Arguments to update many FixedCostExtras.
     * @example
     * // Update many FixedCostExtras
     * const fixedCostExtra = await prisma.fixedCostExtra.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more FixedCostExtras and only return the `workspaceId`
     * const fixedCostExtraWithWorkspaceIdOnly = await prisma.fixedCostExtra.updateManyAndReturn({
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
    updateManyAndReturn<T extends FixedCostExtraUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FixedCostExtraUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one FixedCostExtra.
     * @param {FixedCostExtraUpsertArgs} args - Arguments to update or create a FixedCostExtra.
     * @example
     * // Update or create a FixedCostExtra
     * const fixedCostExtra = await prisma.fixedCostExtra.upsert({
     *   create: {
     *     // ... data to create a FixedCostExtra
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FixedCostExtra we want to update
     *   }
     * })
     */
    upsert<T extends FixedCostExtraUpsertArgs>(args: Prisma.SelectSubset<T, FixedCostExtraUpsertArgs<ExtArgs>>): Prisma.Prisma__FixedCostExtraClient<runtime.Types.Result.GetResult<Prisma.$FixedCostExtraPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of FixedCostExtras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraCountArgs} args - Arguments to filter FixedCostExtras to count.
     * @example
     * // Count the number of FixedCostExtras
     * const count = await prisma.fixedCostExtra.count({
     *   where: {
     *     // ... the filter for the FixedCostExtras we want to count
     *   }
     * })
    **/
    count<T extends FixedCostExtraCountArgs>(args?: Prisma.Subset<T, FixedCostExtraCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FixedCostExtraCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a FixedCostExtra.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FixedCostExtraAggregateArgs>(args: Prisma.Subset<T, FixedCostExtraAggregateArgs>): Prisma.PrismaPromise<GetFixedCostExtraAggregateType<T>>;
    /**
     * Group by FixedCostExtra.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FixedCostExtraGroupByArgs} args - Group by arguments.
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
    groupBy<T extends FixedCostExtraGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FixedCostExtraGroupByArgs['orderBy'];
    } : {
        orderBy?: FixedCostExtraGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FixedCostExtraGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFixedCostExtraGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FixedCostExtra model
     */
    readonly fields: FixedCostExtraFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for FixedCostExtra.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__FixedCostExtraClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the FixedCostExtra model
 */
export interface FixedCostExtraFieldRefs {
    readonly workspaceId: Prisma.FieldRef<"FixedCostExtra", 'String'>;
    readonly id: Prisma.FieldRef<"FixedCostExtra", 'String'>;
    readonly name: Prisma.FieldRef<"FixedCostExtra", 'String'>;
    readonly valueCents: Prisma.FieldRef<"FixedCostExtra", 'BigInt'>;
    readonly position: Prisma.FieldRef<"FixedCostExtra", 'Int'>;
}
/**
 * FixedCostExtra findUnique
 */
export type FixedCostExtraFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * Filter, which FixedCostExtra to fetch.
     */
    where: Prisma.FixedCostExtraWhereUniqueInput;
};
/**
 * FixedCostExtra findUniqueOrThrow
 */
export type FixedCostExtraFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * Filter, which FixedCostExtra to fetch.
     */
    where: Prisma.FixedCostExtraWhereUniqueInput;
};
/**
 * FixedCostExtra findFirst
 */
export type FixedCostExtraFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * Filter, which FixedCostExtra to fetch.
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FixedCostExtras to fetch.
     */
    orderBy?: Prisma.FixedCostExtraOrderByWithRelationInput | Prisma.FixedCostExtraOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FixedCostExtras.
     */
    cursor?: Prisma.FixedCostExtraWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FixedCostExtras from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FixedCostExtras.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FixedCostExtras.
     */
    distinct?: Prisma.FixedCostExtraScalarFieldEnum | Prisma.FixedCostExtraScalarFieldEnum[];
};
/**
 * FixedCostExtra findFirstOrThrow
 */
export type FixedCostExtraFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * Filter, which FixedCostExtra to fetch.
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FixedCostExtras to fetch.
     */
    orderBy?: Prisma.FixedCostExtraOrderByWithRelationInput | Prisma.FixedCostExtraOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FixedCostExtras.
     */
    cursor?: Prisma.FixedCostExtraWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FixedCostExtras from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FixedCostExtras.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FixedCostExtras.
     */
    distinct?: Prisma.FixedCostExtraScalarFieldEnum | Prisma.FixedCostExtraScalarFieldEnum[];
};
/**
 * FixedCostExtra findMany
 */
export type FixedCostExtraFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * Filter, which FixedCostExtras to fetch.
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FixedCostExtras to fetch.
     */
    orderBy?: Prisma.FixedCostExtraOrderByWithRelationInput | Prisma.FixedCostExtraOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FixedCostExtras.
     */
    cursor?: Prisma.FixedCostExtraWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FixedCostExtras from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FixedCostExtras.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FixedCostExtras.
     */
    distinct?: Prisma.FixedCostExtraScalarFieldEnum | Prisma.FixedCostExtraScalarFieldEnum[];
};
/**
 * FixedCostExtra create
 */
export type FixedCostExtraCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * The data needed to create a FixedCostExtra.
     */
    data: Prisma.XOR<Prisma.FixedCostExtraCreateInput, Prisma.FixedCostExtraUncheckedCreateInput>;
};
/**
 * FixedCostExtra createMany
 */
export type FixedCostExtraCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many FixedCostExtras.
     */
    data: Prisma.FixedCostExtraCreateManyInput | Prisma.FixedCostExtraCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * FixedCostExtra createManyAndReturn
 */
export type FixedCostExtraCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * The data used to create many FixedCostExtras.
     */
    data: Prisma.FixedCostExtraCreateManyInput | Prisma.FixedCostExtraCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * FixedCostExtra update
 */
export type FixedCostExtraUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * The data needed to update a FixedCostExtra.
     */
    data: Prisma.XOR<Prisma.FixedCostExtraUpdateInput, Prisma.FixedCostExtraUncheckedUpdateInput>;
    /**
     * Choose, which FixedCostExtra to update.
     */
    where: Prisma.FixedCostExtraWhereUniqueInput;
};
/**
 * FixedCostExtra updateMany
 */
export type FixedCostExtraUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update FixedCostExtras.
     */
    data: Prisma.XOR<Prisma.FixedCostExtraUpdateManyMutationInput, Prisma.FixedCostExtraUncheckedUpdateManyInput>;
    /**
     * Filter which FixedCostExtras to update
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * Limit how many FixedCostExtras to update.
     */
    limit?: number;
};
/**
 * FixedCostExtra updateManyAndReturn
 */
export type FixedCostExtraUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * The data used to update FixedCostExtras.
     */
    data: Prisma.XOR<Prisma.FixedCostExtraUpdateManyMutationInput, Prisma.FixedCostExtraUncheckedUpdateManyInput>;
    /**
     * Filter which FixedCostExtras to update
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * Limit how many FixedCostExtras to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * FixedCostExtra upsert
 */
export type FixedCostExtraUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * The filter to search for the FixedCostExtra to update in case it exists.
     */
    where: Prisma.FixedCostExtraWhereUniqueInput;
    /**
     * In case the FixedCostExtra found by the `where` argument doesn't exist, create a new FixedCostExtra with this data.
     */
    create: Prisma.XOR<Prisma.FixedCostExtraCreateInput, Prisma.FixedCostExtraUncheckedCreateInput>;
    /**
     * In case the FixedCostExtra was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.FixedCostExtraUpdateInput, Prisma.FixedCostExtraUncheckedUpdateInput>;
};
/**
 * FixedCostExtra delete
 */
export type FixedCostExtraDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
    /**
     * Filter which FixedCostExtra to delete.
     */
    where: Prisma.FixedCostExtraWhereUniqueInput;
};
/**
 * FixedCostExtra deleteMany
 */
export type FixedCostExtraDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FixedCostExtras to delete
     */
    where?: Prisma.FixedCostExtraWhereInput;
    /**
     * Limit how many FixedCostExtras to delete.
     */
    limit?: number;
};
/**
 * FixedCostExtra without action
 */
export type FixedCostExtraDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FixedCostExtra
     */
    select?: Prisma.FixedCostExtraSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FixedCostExtra
     */
    omit?: Prisma.FixedCostExtraOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FixedCostExtraInclude<ExtArgs> | null;
};
