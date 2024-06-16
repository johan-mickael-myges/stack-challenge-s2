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

export const useProductStore = defineStore('adminProducts', {
    state: () => ({
        products: [] as Product[],
        product: null as Product | null,
    }),
    actions: {
        async fetchProducts() {
            const response = await apiClient.get('/admin/products');
            this.products = response.data;
        },
        async fetchProduct(id: number) {
            const response = await apiClient.get(`/admin/products/${id}`);
            this.product = productSchema.parse(response.data);
        },
        async createProduct(product: Product, signal?: AbortSignal) {
            await apiClient.post('/admin/products', productSchema.parse(product), { signal });
            await this.fetchProducts();
        },
        async updateProduct(product: Product, signal?: AbortSignal) {
            await apiClient.put(`/admin/products/${product.id}`, productSchema.parse(product), { signal });
            await this.fetchProducts();
        },
        async deleteProduct(id: number, signal?: AbortSignal) {
            await apiClient.delete(`/admin/products/${id}`, { signal });
            await this.fetchProducts();
        },
    },
});