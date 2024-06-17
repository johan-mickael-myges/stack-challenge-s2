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
        loading: false,
        products: [] as Product[],
        product: null as Product | null,
        total: 0,
    }),
    actions: {
        async fetchProducts({ page = 1, itemsPerPage = 10, sortBy = [] as any } = {}) {
            this.loading = true;
            try {
                const response = await apiClient.get('/admin/products', {
                    params: {
                        page: page,
                        limit: itemsPerPage,
                        sortBy: sortBy,
                    },
                });
                this.products = response.data.items;
                this.total = response.data.total;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchProduct(id: number) {
            this.loading = true;
            const response = await apiClient.get(`/admin/products/${id}`);
            this.product = productSchema.parse(response.data);
            this.loading = false;
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