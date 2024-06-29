import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const BrandsSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Brand = z.infer<typeof BrandsSchema>;

export const useBrandStore = defineStore('brands', {
    state: () => ({
        loading: false,
        brands: [] as Brand[],
        brand: null as Brand | null,
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: [] as any,
    }),
    actions: {
        async fetchBrands() {
            this.loading = true;
            try {
                const response = await apiClient.get('/brands', {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        sortBy: this.sortBy,
                    },
                });
                this.brands = response.data.items;
                this.total = response.data.total;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchBrand(id: number) {
            try {
                const response = await apiClient.get(`/brands/${id}`);
                this.brand = BrandsSchema.parse(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createBrand(brand: Brand, signal?: AbortSignal) {
            try {
                const response = await apiClient.post('/brands', BrandsSchema.parse(brand), { signal });
                this.brands.push(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateBrand(brand: Brand, signal?: AbortSignal) {
            try {
                await apiClient.put(`/brands/${brand.id}`, BrandsSchema.parse(brand), { signal });
                await this.fetchBrands();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteBrand(id: number, signal?: AbortSignal) {
            try {
                await apiClient.delete(`/brands/${id}`, { signal });
                await this.fetchBrands();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async setPage(page: number) {
            this.currentPage = page;
            await this.fetchBrands();
        },
        async setItemsPerPage(itemsPerPage: number) {
            this.itemsPerPage = itemsPerPage;
            await this.fetchBrands();
        },
        async setSortBy(sortBy: any) {
            this.sortBy = sortBy;
            await this.fetchBrands();
        },
    },
});