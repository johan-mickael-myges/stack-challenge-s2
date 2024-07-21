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
    thumbnail: z.instanceof(File).nullable(),
    images: z.array(z.instanceof(File)).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

const productSchemaEntity = z.object({
    id: z.number().optional(),
    name: z.string(),
    brandId: z.number().nullable(),
    reference: z.string(),
    description: z.string().optional(),
    price: z.number(),
    weight: z.number(),
    thumbnail: z.string(),
    images: z.array(z.string()).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    categories: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })),
    colors: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })),
    materials: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })),
    brand: z.object({
        id: z.number(),
        name: z.string(),
    }),

});

export type Product = z.infer<typeof productSchema>;
export type ProductEntity = z.infer<typeof productSchemaEntity>;

export const useProductStore = defineStore('products', {
    state: () => ({
        loading: false,
        products: [] as Product[] | [] as ProductEntity[],
        product: null as Product | null as ProductEntity | null,
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: [] as any,
    }),
    actions: {
        async countProducts(params?: {}) {
            try {
                const response = await apiClient.get('/products/count', {
                    params: {
                        denormalize: true,
                        ...params,
                    }
                });
                this.total = response.data;
            } catch (error) {
                throw error;
            }
        },
        async fetchProducts(params?: {}) {
            try {
                const response = await apiClient.get('/products', {
                    params: {
                        denormalize: true,
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        sortBy: this.sortBy,
                        ...params,
                    },
                });
                this.products = response.data;
            } catch (error) {
                throw error;
            }
        },
        async fetchProduct(id: number, params: {}) {
            this.loading = true;
            try {
                const response = await apiClient.get(`/products/${id}`, {
                    params
                });
                this.product = response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createProduct(formData: FormData, signal?: AbortSignal) {
            this.loading = true;
            try {
                const response = await apiClient.post('/products', formData, { signal });
                this.products.push(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateProduct(id: Number, formData: FormData, signal?: AbortSignal) {
            try {
                await apiClient.put(`/products/${id}`, formData, { signal });
                await this.fetchProducts();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteProduct(id: number, signal?: AbortSignal) {
            try {
                await apiClient.delete(`/products/${id}`, { signal });
                await this.fetchAndCountProducts();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchAndCountProducts(params?: {}) {
            this.loading = true;
            await this.fetchProducts(params);
            await this.countProducts(params);
            this.loading = false;
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
        },
        async addStock(data, signal?: AbortSignal) {
            this.loading = true;
            try {
                await apiClient.post(`/products/${data.id}/stocks`, data, { signal });
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        totalPage(): number {
            return Math.ceil(this.total / this.itemsPerPage);
        },
    }
});