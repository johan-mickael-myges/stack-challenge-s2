import {z} from "zod";

const FacetValueItemSchema = z.object({
    _id: z.string(),
    count: z.number(),
});

const FacetOtherItemSchema = z.object({
    _id: z.literal('Autres'),
    count: z.number(),
    items: z.array(FacetValueItemSchema),
    other: z.literal(true),
});

export const FacetValueCheckboxSchema = z.union([FacetValueItemSchema, FacetOtherItemSchema]);

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
