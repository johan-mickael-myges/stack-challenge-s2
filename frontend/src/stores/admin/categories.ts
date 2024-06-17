import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const categoriesSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Category = z.infer<typeof categoriesSchema>;

export const useCategoryStore = defineStore('adminCategories', {
    state: () => ({
        loading: false,
        categories: [] as Category[],
        category: null as Category | null,
        total: 0,
    }),
    actions: {
        async fetchCategories({ page = 1, itemsPerPage = 10, sortBy = [] as any } = {}) {
            try {
                const response = await apiClient.get('/admin/categories', {
                    params: {
                        page: page,
                        limit: itemsPerPage,
                        sortBy: sortBy,
                    },
                });
                this.categories = response.data.items;
                this.total = response.data.total;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchCategory(id: number) {
            const response = await apiClient.get(`/admin/categories/${id}`);
            this.category = categoriesSchema.parse(response.data);
        },
        async createCategory(category: Category, signal?: AbortSignal) {
            await apiClient.post('/admin/categories', categoriesSchema.parse(category), { signal });
            await this.fetchCategories();
        },
        async updateCategory(category: Category, signal?: AbortSignal) {
            await apiClient.put(`/admin/categories/${category.id}`, categoriesSchema.parse(category), { signal });
            await this.fetchCategories();
        },
        async deleteCategory(id: number, signal?: AbortSignal) {
            await apiClient.delete(`/admin/categories/${id}`, { signal });
            await this.fetchCategories();
        },
    },
});