import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';
import { ProductFacetsSchema } from "@/types/schemas/products";

type SelectedFacets = Record<string, string | string[]>;

export const useProductFacetsStore = defineStore('productFacets', {
    state: () => ({
        loading: false,
        facets: [] as z.infer<typeof ProductFacetsSchema>,
        selectedFacets: {} as SelectedFacets,
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
        setSelectedFacets(values: Record<string, string | string[]>) {
            this.selectedFacets = values;
        }
    },
});