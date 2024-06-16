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

export type Products = z.infer<typeof productSchema>;

export const useProductStore = defineStore('adminProducts', {
    state: () => ({
        products: [] as Products[],
        product: null as Products | null,
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
        async createProduct(product: Products) {
            await apiClient.post('/admin/products', productSchema.parse(product));
            await this.fetchProducts();
        },
        async updateProduct(product: Products) {
            await apiClient.put(`/admin/products/${product.id}`, productSchema.parse(product));
            await this.fetchProducts();
        },
        async deleteProduct(id: number) {
            await apiClient.delete(`/admin/products/${id}`);
            await this.fetchProducts();
        },
    },
});