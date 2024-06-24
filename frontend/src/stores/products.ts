import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const productSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    brandId: z.number().nullable(),
    reference: z.string(),
    description: z.string().optional(),
    price: z.number(),
    images: z.array(z.string()).optional(),
});

export type Product = z.infer<typeof productSchema>;

export const useProductStore = defineStore('products', {
    state: () => ({
        loading: false,
        products: [] as Product[],
        product: null as Product | null,
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: [] as any,
    }),
    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await apiClient.get('/products', {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        sortBy: this.sortBy,
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
            try {
                const response = await apiClient.get(`/products/${id}`);
                this.product = productSchema.parse(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
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
        async setPage(page: number) {
            this.currentPage = page;
            await this.fetchProducts();
        },
        async setItemsPerPage(itemsPerPage: number) {
            this.itemsPerPage = itemsPerPage;
            await this.fetchProducts();
        },
        async setSortBy(sortBy: any) {
            this.sortBy = sortBy;
            await this.fetchProducts();
        }
    },
});