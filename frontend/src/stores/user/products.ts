import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const productSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    reference: z.string(),
    description: z.string().optional(),
    price: z.number(),
    images: z.array(z.string()).optional(),
});

export type Product = z.infer<typeof productSchema>;

export const useProductStore = defineStore('userProducts', {
    state: () => ({
        products: [] as Product[],
        product: null as Product | null,
    }),
    actions: {
        async fetchProducts() {
            const response = await apiClient.get('/user/products');
            this.products = response.data;
        },
        async fetchProduct(id: number) {
            const response = await apiClient.get(`/user/products/${id}`);
            this.product = productSchema.parse(response.data);
        },
    },
});