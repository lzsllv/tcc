import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.ts";
import type * as Prisma from "../internal/prismaNamespace.ts";
/**
 * Model Ingredient
 *
 */
export type IngredientModel = runtime.Types.Result.DefaultSelection<Prisma.$IngredientPayload>;
export type AggregateIngredient = {
    _count: IngredientCountAggregateOutputType | null;
    _avg: IngredientAvgAggregateOutputType | null;
    _sum: IngredientSumAggregateOutputType | null;
    _min: IngredientMinAggregateOutputType | null;
    _max: IngredientMaxAggregateOutputType | null;
};
export type IngredientAvgAggregateOutputType = {
    purchasePriceCents: number | null;
    purchaseQuantity: runtime.Decimal | null;
};
export type IngredientSumAggregateOutputType = {
    purchasePriceCents: bigint | null;
    purchaseQuantity: runtime.Decimal | null;
};
export type IngredientMinAggregateOutputType = {
    workspaceId: string | null;
    id: string | null;
    name: string | null;
    category: $Enums.IngredientCategory | null;
    purchasePriceCents: bigint | null;
    purchaseQuantity: runtime.Decimal | null;
    purchaseUnit: $Enums.Unit | null;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IngredientMaxAggregateOutputType = {
    workspaceId: string | null;
    id: string | null;
    name: string | null;
    category: $Enums.IngredientCategory | null;
    purchasePriceCents: bigint | null;
    purchaseQuantity: runtime.Decimal | null;
    purchaseUnit: $Enums.Unit | null;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IngredientCountAggregateOutputType = {
    workspaceId: number;
    id: number;
    name: number;
    category: number;
    purchasePriceCents: number;
    purchaseQuantity: number;
    purchaseUnit: number;
    active: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type IngredientAvgAggregateInputType = {
    purchasePriceCents?: true;
    purchaseQuantity?: true;
};
export type IngredientSumAggregateInputType = {
    purchasePriceCents?: true;
    purchaseQuantity?: true;
};
export type IngredientMinAggregateInputType = {
    workspaceId?: true;
    id?: true;
    name?: true;
    category?: true;
    purchasePriceCents?: true;
    purchaseQuantity?: true;
    purchaseUnit?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IngredientMaxAggregateInputType = {
    workspaceId?: true;
    id?: true;
    name?: true;
    category?: true;
    purchasePriceCents?: true;
    purchaseQuantity?: true;
    purchaseUnit?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IngredientCountAggregateInputType = {
    workspaceId?: true;
    id?: true;
    name?: true;
    category?: true;
    purchasePriceCents?: true;
    purchaseQuantity?: true;
    purchaseUnit?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type IngredientAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Ingredient to aggregate.
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.IngredientWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Ingredients
    **/
    _count?: true | IngredientCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: IngredientAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: IngredientSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: IngredientMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: IngredientMaxAggregateInputType;
};
export type GetIngredientAggregateType<T extends IngredientAggregateArgs> = {
    [P in keyof T & keyof AggregateIngredient]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIngredient[P]> : Prisma.GetScalarType<T[P], AggregateIngredient[P]>;
};
export type IngredientGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IngredientWhereInput;
    orderBy?: Prisma.IngredientOrderByWithAggregationInput | Prisma.IngredientOrderByWithAggregationInput[];
    by: Prisma.IngredientScalarFieldEnum[] | Prisma.IngredientScalarFieldEnum;
    having?: Prisma.IngredientScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IngredientCountAggregateInputType | true;
    _avg?: IngredientAvgAggregateInputType;
    _sum?: IngredientSumAggregateInputType;
    _min?: IngredientMinAggregateInputType;
    _max?: IngredientMaxAggregateInputType;
};
export type IngredientGroupByOutputType = {
    workspaceId: string;
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint;
    purchaseQuantity: runtime.Decimal;
    purchaseUnit: $Enums.Unit;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: IngredientCountAggregateOutputType | null;
    _avg: IngredientAvgAggregateOutputType | null;
    _sum: IngredientSumAggregateOutputType | null;
    _min: IngredientMinAggregateOutputType | null;
    _max: IngredientMaxAggregateOutputType | null;
};
export type GetIngredientGroupByPayload<T extends IngredientGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IngredientGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IngredientGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IngredientGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IngredientGroupByOutputType[P]>;
}>>;
export type IngredientWhereInput = {
    AND?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    OR?: Prisma.IngredientWhereInput[];
    NOT?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    workspaceId?: Prisma.UuidFilter<"Ingredient"> | string;
    id?: Prisma.StringFilter<"Ingredient"> | string;
    name?: Prisma.StringFilter<"Ingredient"> | string;
    category?: Prisma.EnumIngredientCategoryFilter<"Ingredient"> | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFilter<"Ingredient"> | bigint | number;
    purchaseQuantity?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFilter<"Ingredient"> | $Enums.Unit;
    active?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    components?: Prisma.OfferComponentListRelationFilter;
};
export type IngredientOrderByWithRelationInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
    purchaseUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    components?: Prisma.OfferComponentOrderByRelationAggregateInput;
};
export type IngredientWhereUniqueInput = Prisma.AtLeast<{
    workspaceId_id?: Prisma.IngredientWorkspaceIdIdCompoundUniqueInput;
    AND?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    OR?: Prisma.IngredientWhereInput[];
    NOT?: Prisma.IngredientWhereInput | Prisma.IngredientWhereInput[];
    workspaceId?: Prisma.UuidFilter<"Ingredient"> | string;
    id?: Prisma.StringFilter<"Ingredient"> | string;
    name?: Prisma.StringFilter<"Ingredient"> | string;
    category?: Prisma.EnumIngredientCategoryFilter<"Ingredient"> | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFilter<"Ingredient"> | bigint | number;
    purchaseQuantity?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFilter<"Ingredient"> | $Enums.Unit;
    active?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    components?: Prisma.OfferComponentListRelationFilter;
}, "workspaceId_id">;
export type IngredientOrderByWithAggregationInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
    purchaseUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.IngredientCountOrderByAggregateInput;
    _avg?: Prisma.IngredientAvgOrderByAggregateInput;
    _max?: Prisma.IngredientMaxOrderByAggregateInput;
    _min?: Prisma.IngredientMinOrderByAggregateInput;
    _sum?: Prisma.IngredientSumOrderByAggregateInput;
};
export type IngredientScalarWhereWithAggregatesInput = {
    AND?: Prisma.IngredientScalarWhereWithAggregatesInput | Prisma.IngredientScalarWhereWithAggregatesInput[];
    OR?: Prisma.IngredientScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IngredientScalarWhereWithAggregatesInput | Prisma.IngredientScalarWhereWithAggregatesInput[];
    workspaceId?: Prisma.UuidWithAggregatesFilter<"Ingredient"> | string;
    id?: Prisma.StringWithAggregatesFilter<"Ingredient"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Ingredient"> | string;
    category?: Prisma.EnumIngredientCategoryWithAggregatesFilter<"Ingredient"> | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntWithAggregatesFilter<"Ingredient"> | bigint | number;
    purchaseQuantity?: Prisma.DecimalWithAggregatesFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitWithAggregatesFilter<"Ingredient"> | $Enums.Unit;
    active?: Prisma.BoolWithAggregatesFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Ingredient"> | Date | string;
};
export type IngredientCreateInput = {
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutIngredientsInput;
    components?: Prisma.OfferComponentCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateInput = {
    workspaceId: string;
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    components?: Prisma.OfferComponentUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutIngredientsNestedInput;
    components?: Prisma.OfferComponentUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    components?: Prisma.OfferComponentUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientCreateManyInput = {
    workspaceId: string;
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
};
export type IngredientUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientUncheckedUpdateManyInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientListRelationFilter = {
    every?: Prisma.IngredientWhereInput;
    some?: Prisma.IngredientWhereInput;
    none?: Prisma.IngredientWhereInput;
};
export type IngredientOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type IngredientWorkspaceIdIdCompoundUniqueInput = {
    workspaceId: string;
    id: string;
};
export type IngredientCountOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
    purchaseUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientAvgOrderByAggregateInput = {
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
};
export type IngredientMaxOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
    purchaseUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientMinOrderByAggregateInput = {
    workspaceId?: Prisma.SortOrder;
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
    purchaseUnit?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IngredientSumOrderByAggregateInput = {
    purchasePriceCents?: Prisma.SortOrder;
    purchaseQuantity?: Prisma.SortOrder;
};
export type IngredientScalarRelationFilter = {
    is?: Prisma.IngredientWhereInput;
    isNot?: Prisma.IngredientWhereInput;
};
export type IngredientCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutWorkspaceInput, Prisma.IngredientUncheckedCreateWithoutWorkspaceInput> | Prisma.IngredientCreateWithoutWorkspaceInput[] | Prisma.IngredientUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutWorkspaceInput | Prisma.IngredientCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.IngredientCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
};
export type IngredientUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutWorkspaceInput, Prisma.IngredientUncheckedCreateWithoutWorkspaceInput> | Prisma.IngredientCreateWithoutWorkspaceInput[] | Prisma.IngredientUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutWorkspaceInput | Prisma.IngredientCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.IngredientCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
};
export type IngredientUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutWorkspaceInput, Prisma.IngredientUncheckedCreateWithoutWorkspaceInput> | Prisma.IngredientCreateWithoutWorkspaceInput[] | Prisma.IngredientUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutWorkspaceInput | Prisma.IngredientCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.IngredientUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.IngredientUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.IngredientCreateManyWorkspaceInputEnvelope;
    set?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    disconnect?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    delete?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    connect?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    update?: Prisma.IngredientUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.IngredientUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.IngredientUpdateManyWithWhereWithoutWorkspaceInput | Prisma.IngredientUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.IngredientScalarWhereInput | Prisma.IngredientScalarWhereInput[];
};
export type IngredientUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutWorkspaceInput, Prisma.IngredientUncheckedCreateWithoutWorkspaceInput> | Prisma.IngredientCreateWithoutWorkspaceInput[] | Prisma.IngredientUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutWorkspaceInput | Prisma.IngredientCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.IngredientUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.IngredientUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.IngredientCreateManyWorkspaceInputEnvelope;
    set?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    disconnect?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    delete?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    connect?: Prisma.IngredientWhereUniqueInput | Prisma.IngredientWhereUniqueInput[];
    update?: Prisma.IngredientUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.IngredientUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.IngredientUpdateManyWithWhereWithoutWorkspaceInput | Prisma.IngredientUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.IngredientScalarWhereInput | Prisma.IngredientScalarWhereInput[];
};
export type EnumIngredientCategoryFieldUpdateOperationsInput = {
    set?: $Enums.IngredientCategory;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumUnitFieldUpdateOperationsInput = {
    set?: $Enums.Unit;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type IngredientCreateNestedOneWithoutComponentsInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutComponentsInput, Prisma.IngredientUncheckedCreateWithoutComponentsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutComponentsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
};
export type IngredientUpdateOneRequiredWithoutComponentsNestedInput = {
    create?: Prisma.XOR<Prisma.IngredientCreateWithoutComponentsInput, Prisma.IngredientUncheckedCreateWithoutComponentsInput>;
    connectOrCreate?: Prisma.IngredientCreateOrConnectWithoutComponentsInput;
    upsert?: Prisma.IngredientUpsertWithoutComponentsInput;
    connect?: Prisma.IngredientWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.IngredientUpdateToOneWithWhereWithoutComponentsInput, Prisma.IngredientUpdateWithoutComponentsInput>, Prisma.IngredientUncheckedUpdateWithoutComponentsInput>;
};
export type IngredientCreateWithoutWorkspaceInput = {
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    components?: Prisma.OfferComponentCreateNestedManyWithoutIngredientInput;
};
export type IngredientUncheckedCreateWithoutWorkspaceInput = {
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    components?: Prisma.OfferComponentUncheckedCreateNestedManyWithoutIngredientInput;
};
export type IngredientCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutWorkspaceInput, Prisma.IngredientUncheckedCreateWithoutWorkspaceInput>;
};
export type IngredientCreateManyWorkspaceInputEnvelope = {
    data: Prisma.IngredientCreateManyWorkspaceInput | Prisma.IngredientCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type IngredientUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.IngredientWhereUniqueInput;
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutWorkspaceInput, Prisma.IngredientUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutWorkspaceInput, Prisma.IngredientUncheckedCreateWithoutWorkspaceInput>;
};
export type IngredientUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.IngredientWhereUniqueInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutWorkspaceInput, Prisma.IngredientUncheckedUpdateWithoutWorkspaceInput>;
};
export type IngredientUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.IngredientScalarWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type IngredientScalarWhereInput = {
    AND?: Prisma.IngredientScalarWhereInput | Prisma.IngredientScalarWhereInput[];
    OR?: Prisma.IngredientScalarWhereInput[];
    NOT?: Prisma.IngredientScalarWhereInput | Prisma.IngredientScalarWhereInput[];
    workspaceId?: Prisma.UuidFilter<"Ingredient"> | string;
    id?: Prisma.StringFilter<"Ingredient"> | string;
    name?: Prisma.StringFilter<"Ingredient"> | string;
    category?: Prisma.EnumIngredientCategoryFilter<"Ingredient"> | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFilter<"Ingredient"> | bigint | number;
    purchaseQuantity?: Prisma.DecimalFilter<"Ingredient"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFilter<"Ingredient"> | $Enums.Unit;
    active?: Prisma.BoolFilter<"Ingredient"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Ingredient"> | Date | string;
};
export type IngredientCreateWithoutComponentsInput = {
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutIngredientsInput;
};
export type IngredientUncheckedCreateWithoutComponentsInput = {
    workspaceId: string;
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
};
export type IngredientCreateOrConnectWithoutComponentsInput = {
    where: Prisma.IngredientWhereUniqueInput;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutComponentsInput, Prisma.IngredientUncheckedCreateWithoutComponentsInput>;
};
export type IngredientUpsertWithoutComponentsInput = {
    update: Prisma.XOR<Prisma.IngredientUpdateWithoutComponentsInput, Prisma.IngredientUncheckedUpdateWithoutComponentsInput>;
    create: Prisma.XOR<Prisma.IngredientCreateWithoutComponentsInput, Prisma.IngredientUncheckedCreateWithoutComponentsInput>;
    where?: Prisma.IngredientWhereInput;
};
export type IngredientUpdateToOneWithWhereWithoutComponentsInput = {
    where?: Prisma.IngredientWhereInput;
    data: Prisma.XOR<Prisma.IngredientUpdateWithoutComponentsInput, Prisma.IngredientUncheckedUpdateWithoutComponentsInput>;
};
export type IngredientUpdateWithoutComponentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutIngredientsNestedInput;
};
export type IngredientUncheckedUpdateWithoutComponentsInput = {
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IngredientCreateManyWorkspaceInput = {
    id: string;
    name: string;
    category: $Enums.IngredientCategory;
    purchasePriceCents: bigint | number;
    purchaseQuantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit: $Enums.Unit;
    active?: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
};
export type IngredientUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    components?: Prisma.OfferComponentUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    components?: Prisma.OfferComponentUncheckedUpdateManyWithoutIngredientNestedInput;
};
export type IngredientUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumIngredientCategoryFieldUpdateOperationsInput | $Enums.IngredientCategory;
    purchasePriceCents?: Prisma.BigIntFieldUpdateOperationsInput | bigint | number;
    purchaseQuantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    purchaseUnit?: Prisma.EnumUnitFieldUpdateOperationsInput | $Enums.Unit;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type IngredientCountOutputType
 */
export type IngredientCountOutputType = {
    components: number;
};
export type IngredientCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    components?: boolean | IngredientCountOutputTypeCountComponentsArgs;
};
/**
 * IngredientCountOutputType without action
 */
export type IngredientCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngredientCountOutputType
     */
    select?: Prisma.IngredientCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * IngredientCountOutputType without action
 */
export type IngredientCountOutputTypeCountComponentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OfferComponentWhereInput;
};
export type IngredientSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    category?: boolean;
    purchasePriceCents?: boolean;
    purchaseQuantity?: boolean;
    purchaseUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    components?: boolean | Prisma.Ingredient$componentsArgs<ExtArgs>;
    _count?: boolean | Prisma.IngredientCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    category?: boolean;
    purchasePriceCents?: boolean;
    purchaseQuantity?: boolean;
    purchaseUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    category?: boolean;
    purchasePriceCents?: boolean;
    purchaseQuantity?: boolean;
    purchaseUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["ingredient"]>;
export type IngredientSelectScalar = {
    workspaceId?: boolean;
    id?: boolean;
    name?: boolean;
    category?: boolean;
    purchasePriceCents?: boolean;
    purchaseQuantity?: boolean;
    purchaseUnit?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type IngredientOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"workspaceId" | "id" | "name" | "category" | "purchasePriceCents" | "purchaseQuantity" | "purchaseUnit" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["ingredient"]>;
export type IngredientInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    components?: boolean | Prisma.Ingredient$componentsArgs<ExtArgs>;
    _count?: boolean | Prisma.IngredientCountOutputTypeDefaultArgs<ExtArgs>;
};
export type IngredientIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type IngredientIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type $IngredientPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Ingredient";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        components: Prisma.$OfferComponentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        workspaceId: string;
        id: string;
        name: string;
        category: $Enums.IngredientCategory;
        purchasePriceCents: bigint;
        purchaseQuantity: runtime.Decimal;
        purchaseUnit: $Enums.Unit;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["ingredient"]>;
    composites: {};
};
export type IngredientGetPayload<S extends boolean | null | undefined | IngredientDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IngredientPayload, S>;
export type IngredientCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IngredientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IngredientCountAggregateInputType | true;
};
export interface IngredientDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Ingredient'];
        meta: {
            name: 'Ingredient';
        };
    };
    /**
     * Find zero or one Ingredient that matches the filter.
     * @param {IngredientFindUniqueArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngredientFindUniqueArgs>(args: Prisma.SelectSubset<T, IngredientFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Ingredient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IngredientFindUniqueOrThrowArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngredientFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IngredientFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Ingredient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindFirstArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngredientFindFirstArgs>(args?: Prisma.SelectSubset<T, IngredientFindFirstArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Ingredient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindFirstOrThrowArgs} args - Arguments to find a Ingredient
     * @example
     * // Get one Ingredient
     * const ingredient = await prisma.ingredient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngredientFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IngredientFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Ingredients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ingredients
     * const ingredients = await prisma.ingredient.findMany()
     *
     * // Get first 10 Ingredients
     * const ingredients = await prisma.ingredient.findMany({ take: 10 })
     *
     * // Only select the `workspaceId`
     * const ingredientWithWorkspaceIdOnly = await prisma.ingredient.findMany({ select: { workspaceId: true } })
     *
     */
    findMany<T extends IngredientFindManyArgs>(args?: Prisma.SelectSubset<T, IngredientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Ingredient.
     * @param {IngredientCreateArgs} args - Arguments to create a Ingredient.
     * @example
     * // Create one Ingredient
     * const Ingredient = await prisma.ingredient.create({
     *   data: {
     *     // ... data to create a Ingredient
     *   }
     * })
     *
     */
    create<T extends IngredientCreateArgs>(args: Prisma.SelectSubset<T, IngredientCreateArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Ingredients.
     * @param {IngredientCreateManyArgs} args - Arguments to create many Ingredients.
     * @example
     * // Create many Ingredients
     * const ingredient = await prisma.ingredient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends IngredientCreateManyArgs>(args?: Prisma.SelectSubset<T, IngredientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Ingredients and returns the data saved in the database.
     * @param {IngredientCreateManyAndReturnArgs} args - Arguments to create many Ingredients.
     * @example
     * // Create many Ingredients
     * const ingredient = await prisma.ingredient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Ingredients and only return the `workspaceId`
     * const ingredientWithWorkspaceIdOnly = await prisma.ingredient.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends IngredientCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IngredientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Ingredient.
     * @param {IngredientDeleteArgs} args - Arguments to delete one Ingredient.
     * @example
     * // Delete one Ingredient
     * const Ingredient = await prisma.ingredient.delete({
     *   where: {
     *     // ... filter to delete one Ingredient
     *   }
     * })
     *
     */
    delete<T extends IngredientDeleteArgs>(args: Prisma.SelectSubset<T, IngredientDeleteArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Ingredient.
     * @param {IngredientUpdateArgs} args - Arguments to update one Ingredient.
     * @example
     * // Update one Ingredient
     * const ingredient = await prisma.ingredient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends IngredientUpdateArgs>(args: Prisma.SelectSubset<T, IngredientUpdateArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Ingredients.
     * @param {IngredientDeleteManyArgs} args - Arguments to filter Ingredients to delete.
     * @example
     * // Delete a few Ingredients
     * const { count } = await prisma.ingredient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends IngredientDeleteManyArgs>(args?: Prisma.SelectSubset<T, IngredientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ingredients
     * const ingredient = await prisma.ingredient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends IngredientUpdateManyArgs>(args: Prisma.SelectSubset<T, IngredientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Ingredients and returns the data updated in the database.
     * @param {IngredientUpdateManyAndReturnArgs} args - Arguments to update many Ingredients.
     * @example
     * // Update many Ingredients
     * const ingredient = await prisma.ingredient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Ingredients and only return the `workspaceId`
     * const ingredientWithWorkspaceIdOnly = await prisma.ingredient.updateManyAndReturn({
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
    updateManyAndReturn<T extends IngredientUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IngredientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Ingredient.
     * @param {IngredientUpsertArgs} args - Arguments to update or create a Ingredient.
     * @example
     * // Update or create a Ingredient
     * const ingredient = await prisma.ingredient.upsert({
     *   create: {
     *     // ... data to create a Ingredient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ingredient we want to update
     *   }
     * })
     */
    upsert<T extends IngredientUpsertArgs>(args: Prisma.SelectSubset<T, IngredientUpsertArgs<ExtArgs>>): Prisma.Prisma__IngredientClient<runtime.Types.Result.GetResult<Prisma.$IngredientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Ingredients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientCountArgs} args - Arguments to filter Ingredients to count.
     * @example
     * // Count the number of Ingredients
     * const count = await prisma.ingredient.count({
     *   where: {
     *     // ... the filter for the Ingredients we want to count
     *   }
     * })
    **/
    count<T extends IngredientCountArgs>(args?: Prisma.Subset<T, IngredientCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IngredientCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Ingredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IngredientAggregateArgs>(args: Prisma.Subset<T, IngredientAggregateArgs>): Prisma.PrismaPromise<GetIngredientAggregateType<T>>;
    /**
     * Group by Ingredient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngredientGroupByArgs} args - Group by arguments.
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
    groupBy<T extends IngredientGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IngredientGroupByArgs['orderBy'];
    } : {
        orderBy?: IngredientGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IngredientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngredientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Ingredient model
     */
    readonly fields: IngredientFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Ingredient.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__IngredientClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    components<T extends Prisma.Ingredient$componentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Ingredient$componentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OfferComponentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Ingredient model
 */
export interface IngredientFieldRefs {
    readonly workspaceId: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly id: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly name: Prisma.FieldRef<"Ingredient", 'String'>;
    readonly category: Prisma.FieldRef<"Ingredient", 'IngredientCategory'>;
    readonly purchasePriceCents: Prisma.FieldRef<"Ingredient", 'BigInt'>;
    readonly purchaseQuantity: Prisma.FieldRef<"Ingredient", 'Decimal'>;
    readonly purchaseUnit: Prisma.FieldRef<"Ingredient", 'Unit'>;
    readonly active: Prisma.FieldRef<"Ingredient", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Ingredient", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Ingredient", 'DateTime'>;
}
/**
 * Ingredient findUnique
 */
export type IngredientFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * Filter, which Ingredient to fetch.
     */
    where: Prisma.IngredientWhereUniqueInput;
};
/**
 * Ingredient findUniqueOrThrow
 */
export type IngredientFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * Filter, which Ingredient to fetch.
     */
    where: Prisma.IngredientWhereUniqueInput;
};
/**
 * Ingredient findFirst
 */
export type IngredientFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * Filter, which Ingredient to fetch.
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Ingredients.
     */
    cursor?: Prisma.IngredientWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Ingredients.
     */
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
/**
 * Ingredient findFirstOrThrow
 */
export type IngredientFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * Filter, which Ingredient to fetch.
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Ingredients.
     */
    cursor?: Prisma.IngredientWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Ingredients.
     */
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
/**
 * Ingredient findMany
 */
export type IngredientFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * Filter, which Ingredients to fetch.
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Ingredients to fetch.
     */
    orderBy?: Prisma.IngredientOrderByWithRelationInput | Prisma.IngredientOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Ingredients.
     */
    cursor?: Prisma.IngredientWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Ingredients from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Ingredients.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Ingredients.
     */
    distinct?: Prisma.IngredientScalarFieldEnum | Prisma.IngredientScalarFieldEnum[];
};
/**
 * Ingredient create
 */
export type IngredientCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * The data needed to create a Ingredient.
     */
    data: Prisma.XOR<Prisma.IngredientCreateInput, Prisma.IngredientUncheckedCreateInput>;
};
/**
 * Ingredient createMany
 */
export type IngredientCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ingredients.
     */
    data: Prisma.IngredientCreateManyInput | Prisma.IngredientCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Ingredient createManyAndReturn
 */
export type IngredientCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * The data used to create many Ingredients.
     */
    data: Prisma.IngredientCreateManyInput | Prisma.IngredientCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Ingredient update
 */
export type IngredientUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * The data needed to update a Ingredient.
     */
    data: Prisma.XOR<Prisma.IngredientUpdateInput, Prisma.IngredientUncheckedUpdateInput>;
    /**
     * Choose, which Ingredient to update.
     */
    where: Prisma.IngredientWhereUniqueInput;
};
/**
 * Ingredient updateMany
 */
export type IngredientUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Ingredients.
     */
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyInput>;
    /**
     * Filter which Ingredients to update
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * Limit how many Ingredients to update.
     */
    limit?: number;
};
/**
 * Ingredient updateManyAndReturn
 */
export type IngredientUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * The data used to update Ingredients.
     */
    data: Prisma.XOR<Prisma.IngredientUpdateManyMutationInput, Prisma.IngredientUncheckedUpdateManyInput>;
    /**
     * Filter which Ingredients to update
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * Limit how many Ingredients to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Ingredient upsert
 */
export type IngredientUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * The filter to search for the Ingredient to update in case it exists.
     */
    where: Prisma.IngredientWhereUniqueInput;
    /**
     * In case the Ingredient found by the `where` argument doesn't exist, create a new Ingredient with this data.
     */
    create: Prisma.XOR<Prisma.IngredientCreateInput, Prisma.IngredientUncheckedCreateInput>;
    /**
     * In case the Ingredient was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.IngredientUpdateInput, Prisma.IngredientUncheckedUpdateInput>;
};
/**
 * Ingredient delete
 */
export type IngredientDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
    /**
     * Filter which Ingredient to delete.
     */
    where: Prisma.IngredientWhereUniqueInput;
};
/**
 * Ingredient deleteMany
 */
export type IngredientDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Ingredients to delete
     */
    where?: Prisma.IngredientWhereInput;
    /**
     * Limit how many Ingredients to delete.
     */
    limit?: number;
};
/**
 * Ingredient.components
 */
export type Ingredient$componentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Ingredient without action
 */
export type IngredientDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ingredient
     */
    select?: Prisma.IngredientSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ingredient
     */
    omit?: Prisma.IngredientOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.IngredientInclude<ExtArgs> | null;
};
