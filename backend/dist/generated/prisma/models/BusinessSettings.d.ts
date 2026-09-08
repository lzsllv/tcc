import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.ts";
/**
 * Model BusinessSettings
 *
 */
export type BusinessSettingsModel = runtime.Types.Result.DefaultSelection<Prisma.$BusinessSettingsPayload>;
export type AggregateBusinessSettings = {
    _count: BusinessSettingsCountAggregateOutputType | null;
    _avg: BusinessSettingsAvgAggregateOutputType | null;
    _sum: BusinessSettingsSumAggregateOutputType | null;
    _min: BusinessSettingsMinAggregateOutputType | null;
    _max: BusinessSettingsMaxAggregateOutputType | null;
};
export type BusinessSettingsAvgAggregateOutputType = {
    laborHourCents: number | null;
    defaultMarginBps: number | null;
};
export type BusinessSettingsSumAggregateOutputType = {
    laborHourCents: bigint | null;
    defaultMarginBps: number | null;
};
export type BusinessSettingsMinAggregateOutputType = {
    workspaceId: string | null;
    businessName: string | null;
    logoPath: string | null;
    region: string | null;
    laborHourCents: bigint | null;
    defaultMarginBps: number | null;
    selectedSalesChannelId: string | null;
};
export type BusinessSettingsMaxAggregateOutputType = {
    workspaceId: string | null;
    businessName: string | null;
    logoPath: string | null;
    region: string | null;
    laborHourCents: bigint | null;
    defaultMarginBps: number | null;
    selectedSalesChannelId: string | null;
};
export type BusinessSettingsCountAggregateOutputType = {
    workspaceId: number;
    businessName: number;
    logoPath: number;
    region: number;
    laborHourCents: number;
    defaultMarginBps: number;
    selectedSalesChannelId: number;
    _all: number;
};
export type BusinessSettingsAvgAggregateInputType = {
    laborHourCents?: true;
    defaultMarginBps?: true;
};
export type BusinessSettingsSumAggregateInputType = {
    laborHourCents?: true;
    defaultMarginBps?: true;
};
export type BusinessSettingsMinAggregateInputType = {
    workspaceId?: true;
    businessName?: true;
    logoPath?: true;
    region?: true;
    laborHourCents?: true;
    defaultMarginBps?: true;
    selectedSalesChannelId?: true;
};
export type BusinessSettingsMaxAggregateInputType = {
    workspaceId?: true;
    businessName?: true;
    logoPath?: true;
    region?: true;
    laborHourCents?: true;
    defaultMarginBps?: true;
    selectedSalesChannelId?: true;
};
export type BusinessSettingsCountAggregateInputType = {
    workspaceId?: true;
    businessName?: true;
    logoPath?: true;
    region?: true;
    laborHourCents?: true;
    defaultMarginBps?: true;
    selectedSalesChannelId?: true;
    _all?: true;
};
export type BusinessSettingsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which BusinessSettings to aggregate.
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BusinessSettings to fetch.
     */
    orderBy?: Prisma.BusinessSettingsOrderByWithRelationInput | Prisma.BusinessSettingsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.BusinessSettingsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BusinessSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BusinessSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned BusinessSettings
    **/
    _count?: true | BusinessSettingsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: BusinessSettingsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: BusinessSettingsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BusinessSettingsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BusinessSettingsMaxAggregateInputType;
};
export type GetBusinessSettingsAggregateType<T extends BusinessSettingsAggregateArgs> = {
    [P in keyof T & keyof AggregateBusinessSettings]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBusinessSettings[P]> : Prisma.GetScalarType<T[P], AggregateBusinessSettings[P]>;
};
export type BusinessSettingsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BusinessSettingsWhereInput;
    orderBy?: Prisma.BusinessSettingsOrderByWithAggregationInput | Prisma.BusinessSettingsOrderByWithAggregationInput[];
    by: Prisma.BusinessSettingsScalarFieldEnum[] | Prisma.BusinessSettingsScalarFieldEnum;
    having?: Prisma.BusinessSettingsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BusinessSettingsCountAggregateInputType | true;
    _avg?: BusinessSettingsAvgAggregateInputType;
    _sum?: BusinessSettingsSumAggregateInputType;
    _min?: BusinessSettingsMinAggregateInputType;
    _max?: BusinessSettingsMaxAggregateInputType;
};
export type BusinessSettingsGroupByOutputType = {
    workspaceId: string;
    businessName: string;
    logoPath: string | null;
    region: string;
    laborHourCents: bigint;
    defaultMarginBps: number;
    selectedSalesChannelId: string;
    _count: BusinessSettingsCountAggregateOutputType | null;
    _avg: BusinessSettingsAvgAggregateOutputType | null;
    _sum: BusinessSettingsSumAggregateOutputType | null;
    _min: BusinessSettingsMinAggregateOutputType | null;
    _max: BusinessSettingsMaxAggregateOutputType | null;
};
export type GetBusinessSettingsGroupByPayload<T extends BusinessSettingsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BusinessSettingsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BusinessSettingsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BusinessSettingsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BusinessSettingsGroupByOutputType[P]>;
}>>;
export type BusinessSettingsWhereInput = {
    AND?: Prisma.BusinessSettingsWhereInput | Prisma.BusinessSettingsWhereInput[];
    OR?: Prisma.BusinessSettingsWhereInput[];
    NOT?: Prisma.BusinessSettingsWhereInput | Prisma.BusinessSettingsWhereInput[];
    workspaceId?: Prisma.UuidFilter<"BusinessSettings"> | string;
    businessName?: Prisma.StringFilter<"BusinessSettings"> | string;
    logoPath?: Prisma.StringNullableFilter<"BusinessSettings"> | string | null;
    region?: Prisma.StringFilter<"BusinessSettings"> | string;
    laborHourCents?: Prisma.BigIntFilter<"BusinessSettings"> | bigint | number;
    defaultMarginBps?: Prisma.IntFilter<"BusinessSettings"> | number;
    selectedSalesChannelId?: Prisma.StringFilter<"BusinessSettings"> | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    selectedSalesChannel?: Prisma.XOR<Prisma.SalesChannelScalarRelationFilter, Prisma.SalesChannelWhereInput>;
};
export type BusinessSettingsOrderByWithRelationInput = {
    workspaceId?: Prisma.SortOrder;
    businessName?: Prisma.SortOrder;
    logoPath?: Prisma.SortOrderInput | Prisma.SortOrder;
    region?: Prisma.SortOrder;
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
    selectedSalesChannelId?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    selectedSalesChannel?: Prisma.SalesChannelOrderByWithRelationInput;
};
export type BusinessSettingsWhereUniqueInput = Prisma.AtLeast<{
    workspaceId?: string;
    AND?: Prisma.BusinessSettingsWhereInput | Prisma.BusinessSettingsWhereInput[];
    OR?: Prisma.BusinessSettingsWhereInput[];
    NOT?: Prisma.BusinessSettingsWhereInput | Prisma.BusinessSettingsWhereInput[];
    businessName?: Prisma.StringFilter<"BusinessSettings"> | string;
    logoPath?: Prisma.StringNullableFilter<"BusinessSettings"> | string | null;
    region?: Prisma.StringFilter<"BusinessSettings"> | string;
    laborHourCents?: Prisma.BigIntFilter<"BusinessSettings"> | bigint | number;
    defaultMarginBps?: Prisma.IntFilter<"BusinessSettings"> | number;
    selectedSalesChannelId?: Prisma.StringFilter<"BusinessSettings"> | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    selectedSalesChannel?: Prisma.XOR<Prisma.SalesChannelScalarRelationFilter, Prisma.SalesChannelWhereInput>;
}, "workspaceId">;
export type BusinessSettingsOrderByWithAggregationInput = {
    workspaceId?: Prisma.SortOrder;
    businessName?: Prisma.SortOrder;
    logoPath?: Prisma.SortOrderInput | Prisma.SortOrder;
    region?: Prisma.SortOrder;
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
    selectedSalesChannelId?: Prisma.SortOrder;
    _count?: Prisma.BusinessSettingsCountOrderByAggregateInput;
    _avg?: Prisma.BusinessSettingsAvgOrderByAggregateInput;
    _max?: Prisma.BusinessSettingsMaxOrderByAggregateInput;
    _min?: Prisma.BusinessSettingsMinOrderByAggregateInput;
    _sum?: Prisma.BusinessSettingsSumOrderByAggregateInput;
};
export type BusinessSettingsScalarWhereWithAggregatesInput = {
    AND?: Prisma.BusinessSettingsScalarWhereWithAggregatesInput | Prisma.BusinessSettingsScalarWhereWithAggregatesInput[];
    OR?: Prisma.BusinessSettingsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BusinessSettingsScalarWhereWithAggregatesInput | Prisma.BusinessSettingsScalarWhereWithAggregatesInput[];
    workspaceId?: Prisma.UuidWithAggregatesFilter<"BusinessSettings"> | string;
    businessName?: Prisma.StringWithAggregatesFilter<"BusinessSettings"> | string;
    logoPath?: Prisma.StringNullableWithAggregatesFilter<"BusinessSettings"> | string | null;
    region?: Prisma.StringWithAggregatesFilter<"BusinessSettings"> | string;
    laborHourCents?: Prisma.BigIntWithAggregatesFilter<"BusinessSettings"> | bigint | number;
    defaultMarginBps?: Prisma.IntWithAggregatesFilter<"BusinessSettings"> | number;
    selectedSalesChannelId?: Prisma.StringWithAggregatesFilter<"BusinessSettings"> | string;
};
export type BusinessSettingsCreateInput = {
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutSettingsInput;
    selectedSalesChannel: Prisma.SalesChannelCreateNestedOneWithoutSelectedByInput;
};
export type BusinessSettingsUncheckedCreateInput = {
    workspaceId: string;
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
    selectedSalesChannelId: string;
};
export type BusinessSettingsUpdateInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutSettingsNestedInput;
    selectedSalesChannel?: Prisma.SalesChannelUpdateOneRequiredWithoutSelectedByNestedInput;
};
export type BusinessSettingsUncheckedUpdateInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
    selectedSalesChannelId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BusinessSettingsCreateManyInput = {
    workspaceId: string;
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
    selectedSalesChannelId: string;
};
export type BusinessSettingsUpdateManyMutationInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type BusinessSettingsUncheckedUpdateManyInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
    selectedSalesChannelId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BusinessSettingsNullableScalarRelationFilter = {
    is?: Prisma.BusinessSettingsWhereInput | null;
    isNot?: Prisma.BusinessSettingsWhereInput | null;
};
export type BusinessSettingsCountOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    businessName?: Prisma.SortOrder;
    logoPath?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
    selectedSalesChannelId?: Prisma.SortOrder;
};
export type BusinessSettingsAvgOrderByAggregateInput = {
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
};
export type BusinessSettingsMaxOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    businessName?: Prisma.SortOrder;
    logoPath?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
    selectedSalesChannelId?: Prisma.SortOrder;
};
export type BusinessSettingsMinOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    businessName?: Prisma.SortOrder;
    logoPath?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
    selectedSalesChannelId?: Prisma.SortOrder;
};
export type BusinessSettingsSumOrderByAggregateInput = {
    laborHourCents?: Prisma.SortOrder;
    defaultMarginBps?: Prisma.SortOrder;
};
export type BusinessSettingsListRelationFilter = {
    every?: Prisma.BusinessSettingsWhereInput;
    some?: Prisma.BusinessSettingsWhereInput;
    none?: Prisma.BusinessSettingsWhereInput;
};
export type BusinessSettingsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BusinessSettingsCreateNestedOneWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedCreateWithoutWorkspaceInput>;
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutWorkspaceInput;
    connect?: Prisma.BusinessSettingsWhereUniqueInput;
};
export type BusinessSettingsUncheckedCreateNestedOneWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedCreateWithoutWorkspaceInput>;
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutWorkspaceInput;
    connect?: Prisma.BusinessSettingsWhereUniqueInput;
};
export type BusinessSettingsUpdateOneWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedCreateWithoutWorkspaceInput>;
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutWorkspaceInput;
    upsert?: Prisma.BusinessSettingsUpsertWithoutWorkspaceInput;
    disconnect?: Prisma.BusinessSettingsWhereInput | boolean;
    delete?: Prisma.BusinessSettingsWhereInput | boolean;
    connect?: Prisma.BusinessSettingsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BusinessSettingsUpdateToOneWithWhereWithoutWorkspaceInput, Prisma.BusinessSettingsUpdateWithoutWorkspaceInput>, Prisma.BusinessSettingsUncheckedUpdateWithoutWorkspaceInput>;
};
export type BusinessSettingsUncheckedUpdateOneWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedCreateWithoutWorkspaceInput>;
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutWorkspaceInput;
    upsert?: Prisma.BusinessSettingsUpsertWithoutWorkspaceInput;
    disconnect?: Prisma.BusinessSettingsWhereInput | boolean;
    delete?: Prisma.BusinessSettingsWhereInput | boolean;
    connect?: Prisma.BusinessSettingsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BusinessSettingsUpdateToOneWithWhereWithoutWorkspaceInput, Prisma.BusinessSettingsUpdateWithoutWorkspaceInput>, Prisma.BusinessSettingsUncheckedUpdateWithoutWorkspaceInput>;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BusinessSettingsCreateNestedManyWithoutSelectedSalesChannelInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput> | Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput[] | Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput[];
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput[];
    createMany?: Prisma.BusinessSettingsCreateManySelectedSalesChannelInputEnvelope;
    connect?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
};
export type BusinessSettingsUncheckedCreateNestedManyWithoutSelectedSalesChannelInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput> | Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput[] | Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput[];
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput[];
    createMany?: Prisma.BusinessSettingsCreateManySelectedSalesChannelInputEnvelope;
    connect?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
};
export type BusinessSettingsUpdateManyWithoutSelectedSalesChannelNestedInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput> | Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput[] | Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput[];
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput[];
    upsert?: Prisma.BusinessSettingsUpsertWithWhereUniqueWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsUpsertWithWhereUniqueWithoutSelectedSalesChannelInput[];
    createMany?: Prisma.BusinessSettingsCreateManySelectedSalesChannelInputEnvelope;
    set?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    disconnect?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    delete?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    connect?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    update?: Prisma.BusinessSettingsUpdateWithWhereUniqueWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsUpdateWithWhereUniqueWithoutSelectedSalesChannelInput[];
    updateMany?: Prisma.BusinessSettingsUpdateManyWithWhereWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsUpdateManyWithWhereWithoutSelectedSalesChannelInput[];
    deleteMany?: Prisma.BusinessSettingsScalarWhereInput | Prisma.BusinessSettingsScalarWhereInput[];
};
export type BusinessSettingsUncheckedUpdateManyWithoutSelectedSalesChannelNestedInput = {
    create?: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput> | Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput[] | Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput[];
    connectOrCreate?: Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput[];
    upsert?: Prisma.BusinessSettingsUpsertWithWhereUniqueWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsUpsertWithWhereUniqueWithoutSelectedSalesChannelInput[];
    createMany?: Prisma.BusinessSettingsCreateManySelectedSalesChannelInputEnvelope;
    set?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    disconnect?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    delete?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    connect?: Prisma.BusinessSettingsWhereUniqueInput | Prisma.BusinessSettingsWhereUniqueInput[];
    update?: Prisma.BusinessSettingsUpdateWithWhereUniqueWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsUpdateWithWhereUniqueWithoutSelectedSalesChannelInput[];
    updateMany?: Prisma.BusinessSettingsUpdateManyWithWhereWithoutSelectedSalesChannelInput | Prisma.BusinessSettingsUpdateManyWithWhereWithoutSelectedSalesChannelInput[];
    deleteMany?: Prisma.BusinessSettingsScalarWhereInput | Prisma.BusinessSettingsScalarWhereInput[];
};
export type BusinessSettingsCreateWithoutWorkspaceInput = {
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
    selectedSalesChannel: Prisma.SalesChannelCreateNestedOneWithoutSelectedByInput;
};
export type BusinessSettingsUncheckedCreateWithoutWorkspaceInput = {
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
    selectedSalesChannelId: string;
};
export type BusinessSettingsCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.BusinessSettingsWhereUniqueInput;
    create: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedCreateWithoutWorkspaceInput>;
};
export type BusinessSettingsUpsertWithoutWorkspaceInput = {
    update: Prisma.XOR<Prisma.BusinessSettingsUpdateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedCreateWithoutWorkspaceInput>;
    where?: Prisma.BusinessSettingsWhereInput;
};
export type BusinessSettingsUpdateToOneWithWhereWithoutWorkspaceInput = {
    where?: Prisma.BusinessSettingsWhereInput;
    data: Prisma.XOR<Prisma.BusinessSettingsUpdateWithoutWorkspaceInput, Prisma.BusinessSettingsUncheckedUpdateWithoutWorkspaceInput>;
};
export type BusinessSettingsUpdateWithoutWorkspaceInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
    selectedSalesChannel?: Prisma.SalesChannelUpdateOneRequiredWithoutSelectedByNestedInput;
};
export type BusinessSettingsUncheckedUpdateWithoutWorkspaceInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
    selectedSalesChannelId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BusinessSettingsCreateWithoutSelectedSalesChannelInput = {
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutSettingsInput;
};
export type BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput = {
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
};
export type BusinessSettingsCreateOrConnectWithoutSelectedSalesChannelInput = {
    where: Prisma.BusinessSettingsWhereUniqueInput;
    create: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput>;
};
export type BusinessSettingsCreateManySelectedSalesChannelInputEnvelope = {
    data: Prisma.BusinessSettingsCreateManySelectedSalesChannelInput | Prisma.BusinessSettingsCreateManySelectedSalesChannelInput[];
    skipDuplicates?: boolean;
};
export type BusinessSettingsUpsertWithWhereUniqueWithoutSelectedSalesChannelInput = {
    where: Prisma.BusinessSettingsWhereUniqueInput;
    update: Prisma.XOR<Prisma.BusinessSettingsUpdateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedUpdateWithoutSelectedSalesChannelInput>;
    create: Prisma.XOR<Prisma.BusinessSettingsCreateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedCreateWithoutSelectedSalesChannelInput>;
};
export type BusinessSettingsUpdateWithWhereUniqueWithoutSelectedSalesChannelInput = {
    where: Prisma.BusinessSettingsWhereUniqueInput;
    data: Prisma.XOR<Prisma.BusinessSettingsUpdateWithoutSelectedSalesChannelInput, Prisma.BusinessSettingsUncheckedUpdateWithoutSelectedSalesChannelInput>;
};
export type BusinessSettingsUpdateManyWithWhereWithoutSelectedSalesChannelInput = {
    where: Prisma.BusinessSettingsScalarWhereInput;
    data: Prisma.XOR<Prisma.BusinessSettingsUpdateManyMutationInput, Prisma.BusinessSettingsUncheckedUpdateManyWithoutSelectedSalesChannelInput>;
};
export type BusinessSettingsScalarWhereInput = {
    AND?: Prisma.BusinessSettingsScalarWhereInput | Prisma.BusinessSettingsScalarWhereInput[];
    OR?: Prisma.BusinessSettingsScalarWhereInput[];
    NOT?: Prisma.BusinessSettingsScalarWhereInput | Prisma.BusinessSettingsScalarWhereInput[];
    workspaceId?: Prisma.UuidFilter<"BusinessSettings"> | string;
    businessName?: Prisma.StringFilter<"BusinessSettings"> | string;
    logoPath?: Prisma.StringNullableFilter<"BusinessSettings"> | string | null;
    region?: Prisma.StringFilter<"BusinessSettings"> | string;
    laborHourCents?: Prisma.BigIntFilter<"BusinessSettings"> | bigint | number;
    defaultMarginBps?: Prisma.IntFilter<"BusinessSettings"> | number;
    selectedSalesChannelId?: Prisma.StringFilter<"BusinessSettings"> | string;
};
export type BusinessSettingsCreateManySelectedSalesChannelInput = {
    businessName?: string;
    logoPath?: string | null;
    region?: string;
    laborHourCents?: bigint | number;
    defaultMarginBps?: number;
};
export type BusinessSettingsUpdateWithoutSelectedSalesChannelInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutSettingsNestedInput;
};
export type BusinessSettingsUncheckedUpdateWithoutSelectedSalesChannelInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type BusinessSettingsUncheckedUpdateManyWithoutSelectedSalesChannelInput = {
    businessName?: Prisma.StringFieldUpdateOperationsInput | string;
    logoPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    laborHourCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    defaultMarginBps?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type BusinessSettingsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    businessName?: boolean;
    logoPath?: boolean;
    region?: boolean;
    laborHourCents?: boolean;
    defaultMarginBps?: boolean;
    selectedSalesChannelId?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    selectedSalesChannel?: boolean | Prisma.SalesChannelDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["businessSettings"]>;
export type BusinessSettingsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    businessName?: boolean;
    logoPath?: boolean;
    region?: boolean;
    laborHourCents?: boolean;
    defaultMarginBps?: boolean;
    selectedSalesChannelId?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    selectedSalesChannel?: boolean | Prisma.SalesChannelDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["businessSettings"]>;
export type BusinessSettingsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    businessName?: boolean;
    logoPath?: boolean;
    region?: boolean;
    laborHourCents?: boolean;
    defaultMarginBps?: boolean;
    selectedSalesChannelId?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    selectedSalesChannel?: boolean | Prisma.SalesChannelDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["businessSettings"]>;
export type BusinessSettingsSelectScalar = {
    workspaceId?: boolean;
    businessName?: boolean;
    logoPath?: boolean;
    region?: boolean;
    laborHourCents?: boolean;
    defaultMarginBps?: boolean;
    selectedSalesChannelId?: boolean;
};
export type BusinessSettingsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"workspaceId" | "businessName" | "logoPath" | "region" | "laborHourCents" | "defaultMarginBps" | "selectedSalesChannelId", ExtArgs["result"]["businessSettings"]>;
export type BusinessSettingsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    selectedSalesChannel?: boolean | Prisma.SalesChannelDefaultArgs<ExtArgs>;
};
export type BusinessSettingsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    selectedSalesChannel?: boolean | Prisma.SalesChannelDefaultArgs<ExtArgs>;
};
export type BusinessSettingsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    selectedSalesChannel?: boolean | Prisma.SalesChannelDefaultArgs<ExtArgs>;
};
export type $BusinessSettingsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BusinessSettings";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        selectedSalesChannel: Prisma.$SalesChannelPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        workspaceId: string;
        businessName: string;
        logoPath: string | null;
        region: string;
        laborHourCents: bigint;
        defaultMarginBps: number;
        selectedSalesChannelId: string;
    }, ExtArgs["result"]["businessSettings"]>;
    composites: {};
};
export type BusinessSettingsGetPayload<S extends boolean | null | undefined | BusinessSettingsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload, S>;
export type BusinessSettingsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BusinessSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BusinessSettingsCountAggregateInputType | true;
};
export interface BusinessSettingsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BusinessSettings'];
        meta: {
            name: 'BusinessSettings';
        };
    };
    /**
     * Find zero or one BusinessSettings that matches the filter.
     * @param {BusinessSettingsFindUniqueArgs} args - Arguments to find a BusinessSettings
     * @example
     * // Get one BusinessSettings
     * const businessSettings = await prisma.businessSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessSettingsFindUniqueArgs>(args: Prisma.SelectSubset<T, BusinessSettingsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one BusinessSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BusinessSettingsFindUniqueOrThrowArgs} args - Arguments to find a BusinessSettings
     * @example
     * // Get one BusinessSettings
     * const businessSettings = await prisma.businessSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessSettingsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BusinessSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first BusinessSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsFindFirstArgs} args - Arguments to find a BusinessSettings
     * @example
     * // Get one BusinessSettings
     * const businessSettings = await prisma.businessSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessSettingsFindFirstArgs>(args?: Prisma.SelectSubset<T, BusinessSettingsFindFirstArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first BusinessSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsFindFirstOrThrowArgs} args - Arguments to find a BusinessSettings
     * @example
     * // Get one BusinessSettings
     * const businessSettings = await prisma.businessSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessSettingsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BusinessSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more BusinessSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BusinessSettings
     * const businessSettings = await prisma.businessSettings.findMany()
     *
     * // Get first 10 BusinessSettings
     * const businessSettings = await prisma.businessSettings.findMany({ take: 10 })
     *
     * // Only select the `workspaceId`
     * const businessSettingsWithWorkspaceIdOnly = await prisma.businessSettings.findMany({ select: { workspaceId: true } })
     *
     */
    findMany<T extends BusinessSettingsFindManyArgs>(args?: Prisma.SelectSubset<T, BusinessSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a BusinessSettings.
     * @param {BusinessSettingsCreateArgs} args - Arguments to create a BusinessSettings.
     * @example
     * // Create one BusinessSettings
     * const BusinessSettings = await prisma.businessSettings.create({
     *   data: {
     *     // ... data to create a BusinessSettings
     *   }
     * })
     *
     */
    create<T extends BusinessSettingsCreateArgs>(args: Prisma.SelectSubset<T, BusinessSettingsCreateArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many BusinessSettings.
     * @param {BusinessSettingsCreateManyArgs} args - Arguments to create many BusinessSettings.
     * @example
     * // Create many BusinessSettings
     * const businessSettings = await prisma.businessSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BusinessSettingsCreateManyArgs>(args?: Prisma.SelectSubset<T, BusinessSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many BusinessSettings and returns the data saved in the database.
     * @param {BusinessSettingsCreateManyAndReturnArgs} args - Arguments to create many BusinessSettings.
     * @example
     * // Create many BusinessSettings
     * const businessSettings = await prisma.businessSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many BusinessSettings and only return the `workspaceId`
     * const businessSettingsWithWorkspaceIdOnly = await prisma.businessSettings.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BusinessSettingsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BusinessSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a BusinessSettings.
     * @param {BusinessSettingsDeleteArgs} args - Arguments to delete one BusinessSettings.
     * @example
     * // Delete one BusinessSettings
     * const BusinessSettings = await prisma.businessSettings.delete({
     *   where: {
     *     // ... filter to delete one BusinessSettings
     *   }
     * })
     *
     */
    delete<T extends BusinessSettingsDeleteArgs>(args: Prisma.SelectSubset<T, BusinessSettingsDeleteArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one BusinessSettings.
     * @param {BusinessSettingsUpdateArgs} args - Arguments to update one BusinessSettings.
     * @example
     * // Update one BusinessSettings
     * const businessSettings = await prisma.businessSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BusinessSettingsUpdateArgs>(args: Prisma.SelectSubset<T, BusinessSettingsUpdateArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more BusinessSettings.
     * @param {BusinessSettingsDeleteManyArgs} args - Arguments to filter BusinessSettings to delete.
     * @example
     * // Delete a few BusinessSettings
     * const { count } = await prisma.businessSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BusinessSettingsDeleteManyArgs>(args?: Prisma.SelectSubset<T, BusinessSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more BusinessSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BusinessSettings
     * const businessSettings = await prisma.businessSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BusinessSettingsUpdateManyArgs>(args: Prisma.SelectSubset<T, BusinessSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more BusinessSettings and returns the data updated in the database.
     * @param {BusinessSettingsUpdateManyAndReturnArgs} args - Arguments to update many BusinessSettings.
     * @example
     * // Update many BusinessSettings
     * const businessSettings = await prisma.businessSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more BusinessSettings and only return the `workspaceId`
     * const businessSettingsWithWorkspaceIdOnly = await prisma.businessSettings.updateManyAndReturn({
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
    updateManyAndReturn<T extends BusinessSettingsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BusinessSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one BusinessSettings.
     * @param {BusinessSettingsUpsertArgs} args - Arguments to update or create a BusinessSettings.
     * @example
     * // Update or create a BusinessSettings
     * const businessSettings = await prisma.businessSettings.upsert({
     *   create: {
     *     // ... data to create a BusinessSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BusinessSettings we want to update
     *   }
     * })
     */
    upsert<T extends BusinessSettingsUpsertArgs>(args: Prisma.SelectSubset<T, BusinessSettingsUpsertArgs<ExtArgs>>): Prisma.Prisma__BusinessSettingsClient<runtime.Types.Result.GetResult<Prisma.$BusinessSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of BusinessSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsCountArgs} args - Arguments to filter BusinessSettings to count.
     * @example
     * // Count the number of BusinessSettings
     * const count = await prisma.businessSettings.count({
     *   where: {
     *     // ... the filter for the BusinessSettings we want to count
     *   }
     * })
    **/
    count<T extends BusinessSettingsCountArgs>(args?: Prisma.Subset<T, BusinessSettingsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BusinessSettingsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a BusinessSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BusinessSettingsAggregateArgs>(args: Prisma.Subset<T, BusinessSettingsAggregateArgs>): Prisma.PrismaPromise<GetBusinessSettingsAggregateType<T>>;
    /**
     * Group by BusinessSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessSettingsGroupByArgs} args - Group by arguments.
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
    groupBy<T extends BusinessSettingsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BusinessSettingsGroupByArgs['orderBy'];
    } : {
        orderBy?: BusinessSettingsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BusinessSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the BusinessSettings model
     */
    readonly fields: BusinessSettingsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for BusinessSettings.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__BusinessSettingsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    selectedSalesChannel<T extends Prisma.SalesChannelDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesChannelDefaultArgs<ExtArgs>>): Prisma.Prisma__SalesChannelClient<runtime.Types.Result.GetResult<Prisma.$SalesChannelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the BusinessSettings model
 */
export interface BusinessSettingsFieldRefs {
    readonly workspaceId: Prisma.FieldRef<"BusinessSettings", 'String'>;
    readonly businessName: Prisma.FieldRef<"BusinessSettings", 'String'>;
    readonly logoPath: Prisma.FieldRef<"BusinessSettings", 'String'>;
    readonly region: Prisma.FieldRef<"BusinessSettings", 'String'>;
    readonly laborHourCents: Prisma.FieldRef<"BusinessSettings", 'BigInt'>;
    readonly defaultMarginBps: Prisma.FieldRef<"BusinessSettings", 'Int'>;
    readonly selectedSalesChannelId: Prisma.FieldRef<"BusinessSettings", 'String'>;
}
/**
 * BusinessSettings findUnique
 */
export type BusinessSettingsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * Filter, which BusinessSettings to fetch.
     */
    where: Prisma.BusinessSettingsWhereUniqueInput;
};
/**
 * BusinessSettings findUniqueOrThrow
 */
export type BusinessSettingsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * Filter, which BusinessSettings to fetch.
     */
    where: Prisma.BusinessSettingsWhereUniqueInput;
};
/**
 * BusinessSettings findFirst
 */
export type BusinessSettingsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * Filter, which BusinessSettings to fetch.
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BusinessSettings to fetch.
     */
    orderBy?: Prisma.BusinessSettingsOrderByWithRelationInput | Prisma.BusinessSettingsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BusinessSettings.
     */
    cursor?: Prisma.BusinessSettingsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BusinessSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BusinessSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BusinessSettings.
     */
    distinct?: Prisma.BusinessSettingsScalarFieldEnum | Prisma.BusinessSettingsScalarFieldEnum[];
};
/**
 * BusinessSettings findFirstOrThrow
 */
export type BusinessSettingsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * Filter, which BusinessSettings to fetch.
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BusinessSettings to fetch.
     */
    orderBy?: Prisma.BusinessSettingsOrderByWithRelationInput | Prisma.BusinessSettingsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for BusinessSettings.
     */
    cursor?: Prisma.BusinessSettingsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BusinessSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BusinessSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BusinessSettings.
     */
    distinct?: Prisma.BusinessSettingsScalarFieldEnum | Prisma.BusinessSettingsScalarFieldEnum[];
};
/**
 * BusinessSettings findMany
 */
export type BusinessSettingsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * Filter, which BusinessSettings to fetch.
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of BusinessSettings to fetch.
     */
    orderBy?: Prisma.BusinessSettingsOrderByWithRelationInput | Prisma.BusinessSettingsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing BusinessSettings.
     */
    cursor?: Prisma.BusinessSettingsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` BusinessSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` BusinessSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of BusinessSettings.
     */
    distinct?: Prisma.BusinessSettingsScalarFieldEnum | Prisma.BusinessSettingsScalarFieldEnum[];
};
/**
 * BusinessSettings create
 */
export type BusinessSettingsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * The data needed to create a BusinessSettings.
     */
    data: Prisma.XOR<Prisma.BusinessSettingsCreateInput, Prisma.BusinessSettingsUncheckedCreateInput>;
};
/**
 * BusinessSettings createMany
 */
export type BusinessSettingsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many BusinessSettings.
     */
    data: Prisma.BusinessSettingsCreateManyInput | Prisma.BusinessSettingsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * BusinessSettings createManyAndReturn
 */
export type BusinessSettingsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * The data used to create many BusinessSettings.
     */
    data: Prisma.BusinessSettingsCreateManyInput | Prisma.BusinessSettingsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * BusinessSettings update
 */
export type BusinessSettingsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * The data needed to update a BusinessSettings.
     */
    data: Prisma.XOR<Prisma.BusinessSettingsUpdateInput, Prisma.BusinessSettingsUncheckedUpdateInput>;
    /**
     * Choose, which BusinessSettings to update.
     */
    where: Prisma.BusinessSettingsWhereUniqueInput;
};
/**
 * BusinessSettings updateMany
 */
export type BusinessSettingsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update BusinessSettings.
     */
    data: Prisma.XOR<Prisma.BusinessSettingsUpdateManyMutationInput, Prisma.BusinessSettingsUncheckedUpdateManyInput>;
    /**
     * Filter which BusinessSettings to update
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * Limit how many BusinessSettings to update.
     */
    limit?: number;
};
/**
 * BusinessSettings updateManyAndReturn
 */
export type BusinessSettingsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * The data used to update BusinessSettings.
     */
    data: Prisma.XOR<Prisma.BusinessSettingsUpdateManyMutationInput, Prisma.BusinessSettingsUncheckedUpdateManyInput>;
    /**
     * Filter which BusinessSettings to update
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * Limit how many BusinessSettings to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * BusinessSettings upsert
 */
export type BusinessSettingsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * The filter to search for the BusinessSettings to update in case it exists.
     */
    where: Prisma.BusinessSettingsWhereUniqueInput;
    /**
     * In case the BusinessSettings found by the `where` argument doesn't exist, create a new BusinessSettings with this data.
     */
    create: Prisma.XOR<Prisma.BusinessSettingsCreateInput, Prisma.BusinessSettingsUncheckedCreateInput>;
    /**
     * In case the BusinessSettings was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.BusinessSettingsUpdateInput, Prisma.BusinessSettingsUncheckedUpdateInput>;
};
/**
 * BusinessSettings delete
 */
export type BusinessSettingsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
    /**
     * Filter which BusinessSettings to delete.
     */
    where: Prisma.BusinessSettingsWhereUniqueInput;
};
/**
 * BusinessSettings deleteMany
 */
export type BusinessSettingsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which BusinessSettings to delete
     */
    where?: Prisma.BusinessSettingsWhereInput;
    /**
     * Limit how many BusinessSettings to delete.
     */
    limit?: number;
};
/**
 * BusinessSettings without action
 */
export type BusinessSettingsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessSettings
     */
    select?: Prisma.BusinessSettingsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the BusinessSettings
     */
    omit?: Prisma.BusinessSettingsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BusinessSettingsInclude<ExtArgs> | null;
};
