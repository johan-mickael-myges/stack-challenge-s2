import {z} from "zod";

export const FacetValueCheckboxSchema = z.object({
    _id: z.string(),
    count: z.number(),
});

export const FacetValueRangeSchema = z.object({
    min: z.number(),
    max: z.number(),
});

export const ProductFacetSchema = z.object({
    id: z.string(),
    label: z.string(),
    type: z.union([z.literal('checkbox'), z.literal('range')]),
    values: z.union([z.array(FacetValueCheckboxSchema), FacetValueRangeSchema]),
});

export const ProductFacetsSchema = z.array(ProductFacetSchema);