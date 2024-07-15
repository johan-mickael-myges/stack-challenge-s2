import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const categoriesSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Category = z.infer<typeof categoriesSchema>;

export const useCategoryStore = defineStore('categories', {
    state: () => ({
        loading: false,
        categories: [] as Category[],
        category: null as Category | null,
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: [] as any,
    }),
    actions: {
        async countCategories() {
            try {
                const response = await apiClient.get('/categories/count');
                this.total = response.data;
            } catch (error) {
                throw error;
            }
        },
        async fetchCategories() {
            this.loading = true;
            try {
                const response = await apiClient.get('/categories', {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        sortBy: this.sortBy,
                    },
                });
                this.categories = response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchCategory(id: number) {
            try {
                const response = await apiClient.get(`/categories/${id}`);
                this.category = categoriesSchema.parse(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createCategory(category: Category, signal?: AbortSignal) {
            try {
                const response = await apiClient.post('/categories', categoriesSchema.parse(category), { signal });
                this.categories.push(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateCategory(category: Category, signal?: AbortSignal) {
            try {
                await apiClient.put(`/categories/${category.id}`, categoriesSchema.parse(category), { signal });
                await this.fetchCategories();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteCategory(id: number, signal?: AbortSignal) {
            try {
                await apiClient.delete(`/categories/${id}`, { signal });
                this.categories = this.categories.filter((category) => category.id !== id);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async setPage(page: number) {
            this.currentPage = page;
            await this.fetchCategories();
        },
        async setItemsPerPage(itemsPerPage: number) {
            this.itemsPerPage = itemsPerPage;
            await this.fetchCategories();
        },
        async setSortBy(sortBy: any) {
            this.sortBy = sortBy;
            await this.fetchCategories();
        },
    },
});