import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
/**
 * Model OfferComponent
 *
 */
export type OfferComponentModel = runtime.Types.Result.DefaultSelection<Prisma.$OfferComponentPayload>;
export type AggregateOfferComponent = {
    _count: OfferComponentCountAggregateOutputType | null;
    _avg: OfferComponentAvgAggregateOutputType | null;
    _sum: OfferComponentSumAggregateOutputType | null;
    _min: OfferComponentMinAggregateOutputType | null;
    _max: OfferComponentMaxAggregateOutputType | null;
};
export type OfferComponentAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
    wasteBps: number | null;
    position: number | null;
};
export type OfferComponentSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
    wasteBps: number | null;
    position: number | null;
};
export type OfferComponentMinAggregateOutputType = {
    workspaceId: string | null;
    offerId: string | null;
    id: string | null;
    ingredientId: string | null;
    quantity: runtime.Decimal | null;
    unit: $Enums.Unit | null;
    wasteBps: number | null;
    position: number | null;
};
export type OfferComponentMaxAggregateOutputType = {
    workspaceId: string | null;
    offerId: string | null;
    id: string | null;
    ingredientId: string | null;
    quantity: runtime.Decimal | null;
    unit: $Enums.Unit | null;
    wasteBps: number | null;
    position: number | null;
};
export type OfferComponentCountAggregateOutputType = {
    workspaceId: number;
    offerId: number;
    id: number;
    ingredientId: number;
    quantity: number;
    unit: number;
    wasteBps: number;
    position: number;
    _all: number;
};
export type OfferComponentAvgAggregateInputType = {
    quantity?: true;
    wasteBps?: true;
    position?: true;
};
export type OfferComponentSumAggregateInputType = {
    quantity?: true;
    wasteBps?: true;
    position?: true;
};
export type OfferComponentMinAggregateInputType = {
    workspaceId?: true;
    offerId?: true;
    id?: true;
    ingredientId?: true;
    quantity?: true;
    unit?: true;
    wasteBps?: true;
    position?: true;
};
export type OfferComponentMaxAggregateInputType = {
    workspaceId?: true;
    offerId?: true;
    id?: true;
    ingredientId?: true;
    quantity?: true;
    unit?: true;
    wasteBps?: true;
    position?: true;
};
export type OfferComponentCountAggregateInputType = {
    workspaceId?: true;
    offerId?: true;
    id?: true;
    ingredientId?: true;
    quantity?: true;
    unit?: true;
    wasteBps?: true;
    position?: true;
    _all?: true;
};
export type OfferComponentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OfferComponent to aggregate.
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OfferComponents to fetch.
     */
    orderBy?: Prisma.OfferComponentOrderByWithRelationInput | Prisma.OfferComponentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OfferComponentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OfferComponents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OfferComponents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OfferComponents
    **/
    _count?: true | OfferComponentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OfferComponentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OfferComponentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OfferComponentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OfferComponentMaxAggregateInputType;
};
export type GetOfferComponentAggregateType<T extends OfferComponentAggregateArgs> = {
    [P in keyof T & keyof AggregateOfferComponent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOfferComponent[P]> : Prisma.GetScalarType<T[P], AggregateOfferComponent[P]>;
};
export type OfferComponentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OfferComponentWhereInput;
    orderBy?: Prisma.OfferComponentOrderByWithAggregationInput | Prisma.OfferComponentOrderByWithAggregationInput[];
    by: Prisma.OfferComponentScalarFieldEnum[] | Prisma.OfferComponentScalarFieldEnum;
    having?: Prisma.OfferComponentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OfferComponentCountAggregateInputType | true;
    _avg?: OfferComponentAvgAggregateInputType;
    _sum?: OfferComponentSumAggregateInputType;
    _min?: OfferComponentMinAggregateInputType;
    _max?: OfferComponentMaxAggregateInputType;
};
export type OfferComponentGroupByOutputType = {
    workspaceId: string;
    offerId: string;
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
    _count: OfferComponentCountAggregateOutputType | null;
    _avg: OfferComponentAvgAggregateOutputType | null;
    _sum: OfferComponentSumAggregateOutputType | null;
    _min: OfferComponentMinAggregateOutputType | null;
    _max: OfferComponentMaxAggregateOutputType | null;
};
export type GetOfferComponentGroupByPayload<T extends OfferComponentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OfferComponentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OfferComponentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OfferComponentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OfferComponentGroupByOutputType[P]>;
}>>;
export type OfferComponentWhereInput = {
    AND?: Prisma.OfferComponentWhereInput | Prisma.OfferComponentWhereInput[];
    OR?: Prisma.OfferComponentWhereInput[];
    NOT?: Prisma.OfferComponentWhereInput | Prisma.OfferComponentWhereInput[];
    workspaceId?: Prisma.UuidFilter<"OfferComponent"> | string;
    offerId?: Prisma.StringFilter<"OfferComponent"> | string;
    id?: Prisma.StringFilter<"OfferComponent"> | string;
    ingredientId?: Prisma.StringFilter<"OfferComponent"> | string;
    quantity?: Prisma.DecimalFilter<"OfferComponent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFilter<"OfferComponent"> | $Enums.Unit;
    wasteBps?: Prisma.IntFilter<"OfferComponent"> | number;
    position?: Prisma.IntFilter<"OfferComponent"> | number;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    offer?: Prisma.XOR<Prisma.OfferScalarRelationFilter, Prisma.OfferWhereInput>;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
};
export type OfferComponentOrderByWithRelationInput = {
    workspaceId?: Prisma.SortOrder;
    offerId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    offer?: Prisma.OfferOrderByWithRelationInput;
    ingredient?: Prisma.IngredientOrderByWithRelationInput;
};
export type OfferComponentWhereUniqueInput = Prisma.AtLeast<{
    workspaceId_offerId_ingredientId?: Prisma.OfferComponentWorkspaceIdOfferIdIngredientIdCompoundUniqueInput;
    workspaceId_offerId_id?: Prisma.OfferComponentWorkspaceIdOfferIdIdCompoundUniqueInput;
    AND?: Prisma.OfferComponentWhereInput | Prisma.OfferComponentWhereInput[];
    OR?: Prisma.OfferComponentWhereInput[];
    NOT?: Prisma.OfferComponentWhereInput | Prisma.OfferComponentWhereInput[];
    workspaceId?: Prisma.UuidFilter<"OfferComponent"> | string;
    offerId?: Prisma.StringFilter<"OfferComponent"> | string;
    id?: Prisma.StringFilter<"OfferComponent"> | string;
    ingredientId?: Prisma.StringFilter<"OfferComponent"> | string;
    quantity?: Prisma.DecimalFilter<"OfferComponent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFilter<"OfferComponent"> | $Enums.Unit;
    wasteBps?: Prisma.IntFilter<"OfferComponent"> | number;
    position?: Prisma.IntFilter<"OfferComponent"> | number;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    offer?: Prisma.XOR<Prisma.OfferScalarRelationFilter, Prisma.OfferWhereInput>;
    ingredient?: Prisma.XOR<Prisma.IngredientScalarRelationFilter, Prisma.IngredientWhereInput>;
}, "workspaceId_offerId_id" | "workspaceId_offerId_ingredientId">;
export type OfferComponentOrderByWithAggregationInput = {
    workspaceId?: Prisma.SortOrder;
    offerId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    _count?: Prisma.OfferComponentCountOrderByAggregateInput;
    _avg?: Prisma.OfferComponentAvgOrderByAggregateInput;
    _max?: Prisma.OfferComponentMaxOrderByAggregateInput;
    _min?: Prisma.OfferComponentMinOrderByAggregateInput;
    _sum?: Prisma.OfferComponentSumOrderByAggregateInput;
};
export type OfferComponentScalarWhereWithAggregatesInput = {
    AND?: Prisma.OfferComponentScalarWhereWithAggregatesInput | Prisma.OfferComponentScalarWhereWithAggregatesInput[];
    OR?: Prisma.OfferComponentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OfferComponentScalarWhereWithAggregatesInput | Prisma.OfferComponentScalarWhereWithAggregatesInput[];
    workspaceId?: Prisma.UuidWithAggregatesFilter<"OfferComponent"> | string;
    offerId?: Prisma.StringWithAggregatesFilter<"OfferComponent"> | string;
    id?: Prisma.StringWithAggregatesFilter<"OfferComponent"> | string;
    ingredientId?: Prisma.StringWithAggregatesFilter<"OfferComponent"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"OfferComponent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitWithAggregatesFilter<"OfferComponent"> | $Enums.Unit;
    wasteBps?: Prisma.IntWithAggregatesFilter<"OfferComponent"> | number;
    position?: Prisma.IntWithAggregatesFilter<"OfferComponent"> | number;
};
export type OfferComponentCreateInput = {
    id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutOfferComponentsInput;
    offer: Prisma.OfferCreateNestedOneWithoutComponentsInput;
    ingredient: Prisma.IngredientCreateNestedOneWithoutComponentsInput;
};
export type OfferComponentUncheckedCreateInput = {
    workspaceId: string;
    offerId: string;
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutOfferComponentsNestedInput;
    offer?: Prisma.OfferUpdateOneRequiredWithoutComponentsNestedInput;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutComponentsNestedInput;
};
export type OfferComponentUncheckedUpdateInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    offerId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentCreateManyInput = {
    workspaceId: string;
    offerId: string;
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentUncheckedUpdateManyInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    offerId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentListRelationFilter = {
    every?: Prisma.OfferComponentWhereInput;
    some?: Prisma.OfferComponentWhereInput;
    none?: Prisma.OfferComponentWhereInput;
};
export type OfferComponentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OfferComponentWorkspaceIdOfferIdIngredientIdCompoundUniqueInput = {
    workspaceId: string;
    offerId: string;
    ingredientId: string;
};
export type OfferComponentWorkspaceIdOfferIdIdCompoundUniqueInput = {
    workspaceId: string;
    offerId: string;
    id: string;
};
export type OfferComponentCountOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    offerId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type OfferComponentAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type OfferComponentMaxOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    offerId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type OfferComponentMinOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    offerId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    ingredientId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type OfferComponentSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    wasteBps?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type OfferComponentCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferComponentCreateWithoutWorkspaceInput[] | Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput | Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.OfferComponentCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
};
export type OfferComponentUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferComponentCreateWithoutWorkspaceInput[] | Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput | Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.OfferComponentCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
};
export type OfferComponentUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferComponentCreateWithoutWorkspaceInput[] | Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput | Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.OfferComponentUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferComponentUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.OfferComponentCreateManyWorkspaceInputEnvelope;
    set?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    disconnect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    delete?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    update?: Prisma.OfferComponentUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferComponentUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.OfferComponentUpdateManyWithWhereWithoutWorkspaceInput | Prisma.OfferComponentUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
};
export type OfferComponentUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput> | Prisma.OfferComponentCreateWithoutWorkspaceInput[] | Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput | Prisma.OfferComponentCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.OfferComponentUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferComponentUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.OfferComponentCreateManyWorkspaceInputEnvelope;
    set?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    disconnect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    delete?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    update?: Prisma.OfferComponentUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.OfferComponentUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.OfferComponentUpdateManyWithWhereWithoutWorkspaceInput | Prisma.OfferComponentUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
};
export type OfferComponentCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutIngredientInput, Prisma.OfferComponentUncheckedCreateWithoutIngredientInput> | Prisma.OfferComponentCreateWithoutIngredientInput[] | Prisma.OfferComponentUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutIngredientInput | Prisma.OfferComponentCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.OfferComponentCreateManyIngredientInputEnvelope;
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
};
export type OfferComponentUncheckedCreateNestedManyWithoutIngredientInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutIngredientInput, Prisma.OfferComponentUncheckedCreateWithoutIngredientInput> | Prisma.OfferComponentCreateWithoutIngredientInput[] | Prisma.OfferComponentUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutIngredientInput | Prisma.OfferComponentCreateOrConnectWithoutIngredientInput[];
    createMany?: Prisma.OfferComponentCreateManyIngredientInputEnvelope;
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
};
export type OfferComponentUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutIngredientInput, Prisma.OfferComponentUncheckedCreateWithoutIngredientInput> | Prisma.OfferComponentCreateWithoutIngredientInput[] | Prisma.OfferComponentUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutIngredientInput | Prisma.OfferComponentCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.OfferComponentUpsertWithWhereUniqueWithoutIngredientInput | Prisma.OfferComponentUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.OfferComponentCreateManyIngredientInputEnvelope;
    set?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    disconnect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    delete?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    update?: Prisma.OfferComponentUpdateWithWhereUniqueWithoutIngredientInput | Prisma.OfferComponentUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.OfferComponentUpdateManyWithWhereWithoutIngredientInput | Prisma.OfferComponentUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
};
export type OfferComponentUncheckedUpdateManyWithoutIngredientNestedInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutIngredientInput, Prisma.OfferComponentUncheckedCreateWithoutIngredientInput> | Prisma.OfferComponentCreateWithoutIngredientInput[] | Prisma.OfferComponentUncheckedCreateWithoutIngredientInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutIngredientInput | Prisma.OfferComponentCreateOrConnectWithoutIngredientInput[];
    upsert?: Prisma.OfferComponentUpsertWithWhereUniqueWithoutIngredientInput | Prisma.OfferComponentUpsertWithWhereUniqueWithoutIngredientInput[];
    createMany?: Prisma.OfferComponentCreateManyIngredientInputEnvelope;
    set?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    disconnect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    delete?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    update?: Prisma.OfferComponentUpdateWithWhereUniqueWithoutIngredientInput | Prisma.OfferComponentUpdateWithWhereUniqueWithoutIngredientInput[];
    updateMany?: Prisma.OfferComponentUpdateManyWithWhereWithoutIngredientInput | Prisma.OfferComponentUpdateManyWithWhereWithoutIngredientInput[];
    deleteMany?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
};
export type OfferComponentCreateNestedManyWithoutOfferInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutOfferInput, Prisma.OfferComponentUncheckedCreateWithoutOfferInput> | Prisma.OfferComponentCreateWithoutOfferInput[] | Prisma.OfferComponentUncheckedCreateWithoutOfferInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutOfferInput | Prisma.OfferComponentCreateOrConnectWithoutOfferInput[];
    createMany?: Prisma.OfferComponentCreateManyOfferInputEnvelope;
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
};
export type OfferComponentUncheckedCreateNestedManyWithoutOfferInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutOfferInput, Prisma.OfferComponentUncheckedCreateWithoutOfferInput> | Prisma.OfferComponentCreateWithoutOfferInput[] | Prisma.OfferComponentUncheckedCreateWithoutOfferInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutOfferInput | Prisma.OfferComponentCreateOrConnectWithoutOfferInput[];
    createMany?: Prisma.OfferComponentCreateManyOfferInputEnvelope;
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
};
export type OfferComponentUpdateManyWithoutOfferNestedInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutOfferInput, Prisma.OfferComponentUncheckedCreateWithoutOfferInput> | Prisma.OfferComponentCreateWithoutOfferInput[] | Prisma.OfferComponentUncheckedCreateWithoutOfferInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutOfferInput | Prisma.OfferComponentCreateOrConnectWithoutOfferInput[];
    upsert?: Prisma.OfferComponentUpsertWithWhereUniqueWithoutOfferInput | Prisma.OfferComponentUpsertWithWhereUniqueWithoutOfferInput[];
    createMany?: Prisma.OfferComponentCreateManyOfferInputEnvelope;
    set?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    disconnect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    delete?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    update?: Prisma.OfferComponentUpdateWithWhereUniqueWithoutOfferInput | Prisma.OfferComponentUpdateWithWhereUniqueWithoutOfferInput[];
    updateMany?: Prisma.OfferComponentUpdateManyWithWhereWithoutOfferInput | Prisma.OfferComponentUpdateManyWithWhereWithoutOfferInput[];
    deleteMany?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
};
export type OfferComponentUncheckedUpdateManyWithoutOfferNestedInput = {
    create?: Prisma.XOR<Prisma.OfferComponentCreateWithoutOfferInput, Prisma.OfferComponentUncheckedCreateWithoutOfferInput> | Prisma.OfferComponentCreateWithoutOfferInput[] | Prisma.OfferComponentUncheckedCreateWithoutOfferInput[];
    connectOrCreate?: Prisma.OfferComponentCreateOrConnectWithoutOfferInput | Prisma.OfferComponentCreateOrConnectWithoutOfferInput[];
    upsert?: Prisma.OfferComponentUpsertWithWhereUniqueWithoutOfferInput | Prisma.OfferComponentUpsertWithWhereUniqueWithoutOfferInput[];
    createMany?: Prisma.OfferComponentCreateManyOfferInputEnvelope;
    set?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    disconnect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    delete?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    connect?: Prisma.OfferComponentWhereUniqueInput | Prisma.OfferComponentWhereUniqueInput[];
    update?: Prisma.OfferComponentUpdateWithWhereUniqueWithoutOfferInput | Prisma.OfferComponentUpdateWithWhereUniqueWithoutOfferInput[];
    updateMany?: Prisma.OfferComponentUpdateManyWithWhereWithoutOfferInput | Prisma.OfferComponentUpdateManyWithWhereWithoutOfferInput[];
    deleteMany?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
};
export type OfferComponentCreateWithoutWorkspaceInput = {
    id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
    offer: Prisma.OfferCreateNestedOneWithoutComponentsInput;
    ingredient: Prisma.IngredientCreateNestedOneWithoutComponentsInput;
};
export type OfferComponentUncheckedCreateWithoutWorkspaceInput = {
    offerId: string;
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    create: Prisma.XOR<Prisma.OfferComponentCreateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput>;
};
export type OfferComponentCreateManyWorkspaceInputEnvelope = {
    data: Prisma.OfferComponentCreateManyWorkspaceInput | Prisma.OfferComponentCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type OfferComponentUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    update: Prisma.XOR<Prisma.OfferComponentUpdateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.OfferComponentCreateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedCreateWithoutWorkspaceInput>;
};
export type OfferComponentUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    data: Prisma.XOR<Prisma.OfferComponentUpdateWithoutWorkspaceInput, Prisma.OfferComponentUncheckedUpdateWithoutWorkspaceInput>;
};
export type OfferComponentUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.OfferComponentScalarWhereInput;
    data: Prisma.XOR<Prisma.OfferComponentUpdateManyMutationInput, Prisma.OfferComponentUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type OfferComponentScalarWhereInput = {
    AND?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
    OR?: Prisma.OfferComponentScalarWhereInput[];
    NOT?: Prisma.OfferComponentScalarWhereInput | Prisma.OfferComponentScalarWhereInput[];
    workspaceId?: Prisma.UuidFilter<"OfferComponent"> | string;
    offerId?: Prisma.StringFilter<"OfferComponent"> | string;
    id?: Prisma.StringFilter<"OfferComponent"> | string;
    ingredientId?: Prisma.StringFilter<"OfferComponent"> | string;
    quantity?: Prisma.DecimalFilter<"OfferComponent"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFilter<"OfferComponent"> | $Enums.Unit;
    wasteBps?: Prisma.IntFilter<"OfferComponent"> | number;
    position?: Prisma.IntFilter<"OfferComponent"> | number;
};
export type OfferComponentCreateWithoutIngredientInput = {
    id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutOfferComponentsInput;
    offer: Prisma.OfferCreateNestedOneWithoutComponentsInput;
};
export type OfferComponentUncheckedCreateWithoutIngredientInput = {
    offerId: string;
    id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentCreateOrConnectWithoutIngredientInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    create: Prisma.XOR<Prisma.OfferComponentCreateWithoutIngredientInput, Prisma.OfferComponentUncheckedCreateWithoutIngredientInput>;
};
export type OfferComponentCreateManyIngredientInputEnvelope = {
    data: Prisma.OfferComponentCreateManyIngredientInput | Prisma.OfferComponentCreateManyIngredientInput[];
    skipDuplicates?: boolean;
};
export type OfferComponentUpsertWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    update: Prisma.XOR<Prisma.OfferComponentUpdateWithoutIngredientInput, Prisma.OfferComponentUncheckedUpdateWithoutIngredientInput>;
    create: Prisma.XOR<Prisma.OfferComponentCreateWithoutIngredientInput, Prisma.OfferComponentUncheckedCreateWithoutIngredientInput>;
};
export type OfferComponentUpdateWithWhereUniqueWithoutIngredientInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    data: Prisma.XOR<Prisma.OfferComponentUpdateWithoutIngredientInput, Prisma.OfferComponentUncheckedUpdateWithoutIngredientInput>;
};
export type OfferComponentUpdateManyWithWhereWithoutIngredientInput = {
    where: Prisma.OfferComponentScalarWhereInput;
    data: Prisma.XOR<Prisma.OfferComponentUpdateManyMutationInput, Prisma.OfferComponentUncheckedUpdateManyWithoutIngredientInput>;
};
export type OfferComponentCreateWithoutOfferInput = {
    id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutOfferComponentsInput;
    ingredient: Prisma.IngredientCreateNestedOneWithoutComponentsInput;
};
export type OfferComponentUncheckedCreateWithoutOfferInput = {
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentCreateOrConnectWithoutOfferInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    create: Prisma.XOR<Prisma.OfferComponentCreateWithoutOfferInput, Prisma.OfferComponentUncheckedCreateWithoutOfferInput>;
};
export type OfferComponentCreateManyOfferInputEnvelope = {
    data: Prisma.OfferComponentCreateManyOfferInput | Prisma.OfferComponentCreateManyOfferInput[];
    skipDuplicates?: boolean;
};
export type OfferComponentUpsertWithWhereUniqueWithoutOfferInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    update: Prisma.XOR<Prisma.OfferComponentUpdateWithoutOfferInput, Prisma.OfferComponentUncheckedUpdateWithoutOfferInput>;
    create: Prisma.XOR<Prisma.OfferComponentCreateWithoutOfferInput, Prisma.OfferComponentUncheckedCreateWithoutOfferInput>;
};
export type OfferComponentUpdateWithWhereUniqueWithoutOfferInput = {
    where: Prisma.OfferComponentWhereUniqueInput;
    data: Prisma.XOR<Prisma.OfferComponentUpdateWithoutOfferInput, Prisma.OfferComponentUncheckedUpdateWithoutOfferInput>;
};
export type OfferComponentUpdateManyWithWhereWithoutOfferInput = {
    where: Prisma.OfferComponentScalarWhereInput;
    data: Prisma.XOR<Prisma.OfferComponentUpdateManyMutationInput, Prisma.OfferComponentUncheckedUpdateManyWithoutOfferInput>;
};
export type OfferComponentCreateManyWorkspaceInput = {
    offerId: string;
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    offer?: Prisma.OfferUpdateOneRequiredWithoutComponentsNestedInput;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutComponentsNestedInput;
};
export type OfferComponentUncheckedUpdateWithoutWorkspaceInput = {
    offerId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentUncheckedUpdateManyWithoutWorkspaceInput = {
    offerId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentCreateManyIngredientInput = {
    offerId: string;
    id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentUpdateWithoutIngredientInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutOfferComponentsNestedInput;
    offer?: Prisma.OfferUpdateOneRequiredWithoutComponentsNestedInput;
};
export type OfferComponentUncheckedUpdateWithoutIngredientInput = {
    offerId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentUncheckedUpdateManyWithoutIngredientInput = {
    offerId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentCreateManyOfferInput = {
    id: string;
    ingredientId: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit: $Enums.Unit;
    wasteBps: number;
    position: number;
};
export type OfferComponentUpdateWithoutOfferInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutOfferComponentsNestedInput;
    ingredient?: Prisma.IngredientUpdateOneRequiredWithoutComponentsNestedInput;
};
export type OfferComponentUncheckedUpdateWithoutOfferInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentUncheckedUpdateManyWithoutOfferInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    ingredientId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    unit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    wasteBps?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type OfferComponentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    offerId?: boolean;
    id?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    unit?: boolean;
    wasteBps?: boolean;
    position?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    offer?: boolean | Prisma.OfferDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["offerComponent"]>;
export type OfferComponentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    offerId?: boolean;
    id?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    unit?: boolean;
    wasteBps?: boolean;
    position?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    offer?: boolean | Prisma.OfferDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["offerComponent"]>;
export type OfferComponentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    offerId?: boolean;
    id?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    unit?: boolean;
    wasteBps?: boolean;
    position?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    offer?: boolean | Prisma.OfferDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["offerComponent"]>;
export type OfferComponentSelectScalar = {
    workspaceId?: boolean;
    offerId?: boolean;
    id?: boolean;
    ingredientId?: boolean;
    quantity?: boolean;
    unit?: boolean;
    wasteBps?: boolean;
    position?: boolean;
};
export type OfferComponentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"workspaceId" | "offerId" | "id" | "ingredientId" | "quantity" | "unit" | "wasteBps" | "position", ExtArgs["result"]["offerComponent"]>;
export type OfferComponentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    offer?: boolean | Prisma.OfferDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type OfferComponentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    offer?: boolean | Prisma.OfferDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type OfferComponentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    offer?: boolean | Prisma.OfferDefaultArgs<ExtArgs>;
    ingredient?: boolean | Prisma.IngredientDefaultArgs<ExtArgs>;
};
export type $OfferComponentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OfferComponent";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        offer: Prisma.$OfferPayload<ExtArgs>;
        ingredient: Prisma.$IngredientPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        workspaceId: string;
        offerId: string;
        id: string;
        ingredientId: string;
        quantity: runtime.Decimal;
        unit: $Enums.Unit;
        wasteBps: number;
        position: number;
    }, ExtArgs["result"]["offerComponent"]>;
    composites: {};
};
export type OfferComponentGetPayload<S extends boolean | null | undefined | OfferComponentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload, S>;
export type OfferComponentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OfferComponentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OfferComponentCountAggregateInputType | true;
};
export interface OfferComponentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OfferComponent'];
        meta: {
            name: 'OfferComponent';
        };
    };
    /**
     * Find zero or one OfferComponent that matches the filter.
     * @param {OfferComponentFindUniqueArgs} args - Arguments to find a OfferComponent
     * @example
     * // Get one OfferComponent
     * const offerComponent = await prisma.offerComponent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OfferComponentFindUniqueArgs>(args: Prisma.SelectSubset<T, OfferComponentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one OfferComponent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OfferComponentFindUniqueOrThrowArgs} args - Arguments to find a OfferComponent
     * @example
     * // Get one OfferComponent
     * const offerComponent = await prisma.offerComponent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OfferComponentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OfferComponentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OfferComponent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentFindFirstArgs} args - Arguments to find a OfferComponent
     * @example
     * // Get one OfferComponent
     * const offerComponent = await prisma.offerComponent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OfferComponentFindFirstArgs>(args?: Prisma.SelectSubset<T, OfferComponentFindFirstArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first OfferComponent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentFindFirstOrThrowArgs} args - Arguments to find a OfferComponent
     * @example
     * // Get one OfferComponent
     * const offerComponent = await prisma.offerComponent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OfferComponentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OfferComponentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more OfferComponents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OfferComponents
     * const offerComponents = await prisma.offerComponent.findMany()
     *
     * // Get first 10 OfferComponents
     * const offerComponents = await prisma.offerComponent.findMany({ take: 10 })
     *
     * // Only select the `workspaceId`
     * const offerComponentWithWorkspaceIdOnly = await prisma.offerComponent.findMany({ select: { workspaceId: true } })
     *
     */
    findMany<T extends OfferComponentFindManyArgs>(args?: Prisma.SelectSubset<T, OfferComponentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a OfferComponent.
     * @param {OfferComponentCreateArgs} args - Arguments to create a OfferComponent.
     * @example
     * // Create one OfferComponent
     * const OfferComponent = await prisma.offerComponent.create({
     *   data: {
     *     // ... data to create a OfferComponent
     *   }
     * })
     *
     */
    create<T extends OfferComponentCreateArgs>(args: Prisma.SelectSubset<T, OfferComponentCreateArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many OfferComponents.
     * @param {OfferComponentCreateManyArgs} args - Arguments to create many OfferComponents.
     * @example
     * // Create many OfferComponents
     * const offerComponent = await prisma.offerComponent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OfferComponentCreateManyArgs>(args?: Prisma.SelectSubset<T, OfferComponentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many OfferComponents and returns the data saved in the database.
     * @param {OfferComponentCreateManyAndReturnArgs} args - Arguments to create many OfferComponents.
     * @example
     * // Create many OfferComponents
     * const offerComponent = await prisma.offerComponent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OfferComponents and only return the `workspaceId`
     * const offerComponentWithWorkspaceIdOnly = await prisma.offerComponent.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OfferComponentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OfferComponentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a OfferComponent.
     * @param {OfferComponentDeleteArgs} args - Arguments to delete one OfferComponent.
     * @example
     * // Delete one OfferComponent
     * const OfferComponent = await prisma.offerComponent.delete({
     *   where: {
     *     // ... filter to delete one OfferComponent
     *   }
     * })
     *
     */
    delete<T extends OfferComponentDeleteArgs>(args: Prisma.SelectSubset<T, OfferComponentDeleteArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one OfferComponent.
     * @param {OfferComponentUpdateArgs} args - Arguments to update one OfferComponent.
     * @example
     * // Update one OfferComponent
     * const offerComponent = await prisma.offerComponent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OfferComponentUpdateArgs>(args: Prisma.SelectSubset<T, OfferComponentUpdateArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more OfferComponents.
     * @param {OfferComponentDeleteManyArgs} args - Arguments to filter OfferComponents to delete.
     * @example
     * // Delete a few OfferComponents
     * const { count } = await prisma.offerComponent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OfferComponentDeleteManyArgs>(args?: Prisma.SelectSubset<T, OfferComponentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OfferComponents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OfferComponents
     * const offerComponent = await prisma.offerComponent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OfferComponentUpdateManyArgs>(args: Prisma.SelectSubset<T, OfferComponentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more OfferComponents and returns the data updated in the database.
     * @param {OfferComponentUpdateManyAndReturnArgs} args - Arguments to update many OfferComponents.
     * @example
     * // Update many OfferComponents
     * const offerComponent = await prisma.offerComponent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OfferComponents and only return the `workspaceId`
     * const offerComponentWithWorkspaceIdOnly = await prisma.offerComponent.updateManyAndReturn({
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
    updateManyAndReturn<T extends OfferComponentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OfferComponentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one OfferComponent.
     * @param {OfferComponentUpsertArgs} args - Arguments to update or create a OfferComponent.
     * @example
     * // Update or create a OfferComponent
     * const offerComponent = await prisma.offerComponent.upsert({
     *   create: {
     *     // ... data to create a OfferComponent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OfferComponent we want to update
     *   }
     * })
     */
    upsert<T extends OfferComponentUpsertArgs>(args: Prisma.SelectSubset<T, OfferComponentUpsertArgs<ExtArgs>>): Prisma.Prisma__OfferComponentClient<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of OfferComponents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentCountArgs} args - Arguments to filter OfferComponents to count.
     * @example
     * // Count the number of OfferComponents
     * const count = await prisma.offerComponent.count({
     *   where: {
     *     // ... the filter for the OfferComponents we want to count
     *   }
     * })
    **/
    count<T extends OfferComponentCountArgs>(args?: Prisma.Subset<T, OfferComponentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OfferComponentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a OfferComponent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OfferComponentAggregateArgs>(args: Prisma.Subset<T, OfferComponentAggregateArgs>): Prisma.PrismaPromise<GetOfferComponentAggregateType<T>>;
    /**
     * Group by OfferComponent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OfferComponentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends OfferComponentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OfferComponentGroupByArgs['orderBy'];
    } : {
        orderBy?: OfferComponentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OfferComponentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOfferComponentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OfferComponent model
     */
    readonly fields: OfferComponentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for OfferComponent.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OfferComponentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    offer<T extends Prisma.OfferDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OfferDefaultArgs<ExtArgs>>): Prisma.Prisma__OfferClient<runtime.Types.Result.GetResult<Prisma.$OfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    ingredient<T extends Prisma.IngredientDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.IngredientDefaultArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the OfferComponent model
 */
export interface OfferComponentFieldRefs {
    readonly workspaceId: Prisma.FieldRef<"OfferComponent", 'String'>;
    readonly offerId: Prisma.FieldRef<"OfferComponent", 'String'>;
    readonly id: Prisma.FieldRef<"OfferComponent", 'String'>;
    readonly ingredientId: Prisma.FieldRef<"OfferComponent", 'String'>;
    readonly quantity: Prisma.FieldRef<"OfferComponent", 'Decimal'>;
    readonly unit: Prisma.FieldRef<"OfferComponent", 'Unit'>;
    readonly wasteBps: Prisma.FieldRef<"OfferComponent", 'Int'>;
    readonly position: Prisma.FieldRef<"OfferComponent", 'Int'>;
}
/**
 * OfferComponent findUnique
 */
export type OfferComponentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which OfferComponent to fetch.
     */
    where: Prisma.OfferComponentWhereUniqueInput;
};
/**
 * OfferComponent findUniqueOrThrow
 */
export type OfferComponentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which OfferComponent to fetch.
     */
    where: Prisma.OfferComponentWhereUniqueInput;
};
/**
 * OfferComponent findFirst
 */
export type OfferComponentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which OfferComponent to fetch.
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OfferComponents to fetch.
     */
    orderBy?: Prisma.OfferComponentOrderByWithRelationInput | Prisma.OfferComponentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OfferComponents.
     */
    cursor?: Prisma.OfferComponentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OfferComponents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OfferComponents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OfferComponents.
     */
    distinct?: Prisma.OfferComponentScalarFieldEnum | Prisma.OfferComponentScalarFieldEnum[];
};
/**
 * OfferComponent findFirstOrThrow
 */
export type OfferComponentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which OfferComponent to fetch.
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OfferComponents to fetch.
     */
    orderBy?: Prisma.OfferComponentOrderByWithRelationInput | Prisma.OfferComponentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OfferComponents.
     */
    cursor?: Prisma.OfferComponentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OfferComponents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OfferComponents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OfferComponents.
     */
    distinct?: Prisma.OfferComponentScalarFieldEnum | Prisma.OfferComponentScalarFieldEnum[];
};
/**
 * OfferComponent findMany
 */
export type OfferComponentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which OfferComponents to fetch.
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OfferComponents to fetch.
     */
    orderBy?: Prisma.OfferComponentOrderByWithRelationInput | Prisma.OfferComponentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OfferComponents.
     */
    cursor?: Prisma.OfferComponentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OfferComponents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OfferComponents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OfferComponents.
     */
    distinct?: Prisma.OfferComponentScalarFieldEnum | Prisma.OfferComponentScalarFieldEnum[];
};
/**
 * OfferComponent create
 */
export type OfferComponentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a OfferComponent.
     */
    data: Prisma.XOR<Prisma.OfferComponentCreateInput, Prisma.OfferComponentUncheckedCreateInput>;
};
/**
 * OfferComponent createMany
 */
export type OfferComponentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many OfferComponents.
     */
    data: Prisma.OfferComponentCreateManyInput | Prisma.OfferComponentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * OfferComponent createManyAndReturn
 */
export type OfferComponentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfferComponent
     */
    select?: Prisma.OfferComponentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OfferComponent
     */
    omit?: Prisma.OfferComponentOmit<ExtArgs> | null;
    /**
     * The data used to create many OfferComponents.
     */
    data: Prisma.OfferComponentCreateManyInput | Prisma.OfferComponentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferComponentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * OfferComponent update
 */
export type OfferComponentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a OfferComponent.
     */
    data: Prisma.XOR<Prisma.OfferComponentUpdateInput, Prisma.OfferComponentUncheckedUpdateInput>;
    /**
     * Choose, which OfferComponent to update.
     */
    where: Prisma.OfferComponentWhereUniqueInput;
};
/**
 * OfferComponent updateMany
 */
export type OfferComponentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update OfferComponents.
     */
    data: Prisma.XOR<Prisma.OfferComponentUpdateManyMutationInput, Prisma.OfferComponentUncheckedUpdateManyInput>;
    /**
     * Filter which OfferComponents to update
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * Limit how many OfferComponents to update.
     */
    limit?: number;
};
/**
 * OfferComponent updateManyAndReturn
 */
export type OfferComponentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OfferComponent
     */
    select?: Prisma.OfferComponentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the OfferComponent
     */
    omit?: Prisma.OfferComponentOmit<ExtArgs> | null;
    /**
     * The data used to update OfferComponents.
     */
    data: Prisma.XOR<Prisma.OfferComponentUpdateManyMutationInput, Prisma.OfferComponentUncheckedUpdateManyInput>;
    /**
     * Filter which OfferComponents to update
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * Limit how many OfferComponents to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OfferComponentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * OfferComponent upsert
 */
export type OfferComponentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the OfferComponent to update in case it exists.
     */
    where: Prisma.OfferComponentWhereUniqueInput;
    /**
     * In case the OfferComponent found by the `where` argument doesn't exist, create a new OfferComponent with this data.
     */
    create: Prisma.XOR<Prisma.OfferComponentCreateInput, Prisma.OfferComponentUncheckedCreateInput>;
    /**
     * In case the OfferComponent was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OfferComponentUpdateInput, Prisma.OfferComponentUncheckedUpdateInput>;
};
/**
 * OfferComponent delete
 */
export type OfferComponentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which OfferComponent to delete.
     */
    where: Prisma.OfferComponentWhereUniqueInput;
};
/**
 * OfferComponent deleteMany
 */
export type OfferComponentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which OfferComponents to delete
     */
    where?: Prisma.OfferComponentWhereInput;
    /**
     * Limit how many OfferComponents to delete.
     */
    limit?: number;
};
/**
 * OfferComponent without action
 */
export type OfferComponentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
