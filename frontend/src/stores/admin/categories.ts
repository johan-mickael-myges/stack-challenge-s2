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
        categories: [] as Category[],
        category: null as Category | null,
    }),
    actions: {
        async fetchCategories() {
            const response = await apiClient.get('/admin/categories');
            this.categories = response.data;
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