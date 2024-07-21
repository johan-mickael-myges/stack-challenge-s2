import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const facetSchema = z.object({
    _id: z.string(),
    count: z.number(),
});

const rangeSchema = z.object({
    min: z.number(),
    max: z.number(),
});

const productFacetsSchema = z.object({
    brands: z.array(facetSchema),
    categories: z.array(facetSchema),
    colors: z.array(facetSchema),
    materials: z.array(facetSchema),
    priceRange: z.array(rangeSchema),
    weightRange: z.array(rangeSchema),
});

export type Facet = z.infer<typeof productFacetsSchema>;

export const useProductFacetsStore = defineStore('productFacets', {
    state: () => ({
        loading: false,
        facets: null as Facet | null,
    }),
    actions: {
        async fetchProductFacets(params?: {}) {
            try {
                const response = await apiClient.get('/products/facets', {
                    params: {
                        denormalize: true,
                        ...params,
                    }
                });
                this.facets = response.data;
            } catch (error) {
                throw error;
            }
        },
    },
});