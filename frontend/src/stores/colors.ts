import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const colorsSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Color = z.infer<typeof colorsSchema>;

export const useColorStore = defineStore('colors', {
    state: () => ({
        loading: false,
        colors: [] as Color[],
        color: null as Color |null,
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: [] as any
    }),
    actions: {
        async countColors() {
            try {
                const response = await apiClient.get('/colors/count');
                this.total = response.data;
            } catch (error) {
                throw error;
            }
        },
        async fetchColors() {
            this.loading = true;
            try {
                const response = await apiClient.get('/colors');
                this.colors = response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchColor(id: number) {
            try {
                const response = await apiClient.get(`/colors/${id}`);
                this.color = colorsSchema.parse(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createColor(color: Color, signal?: AbortSignal) {
            try {
                const response = await apiClient.post('/colors', colorsSchema.parse(color), { signal });
                this.colors.push(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateColor(color: Color, signal?: AbortSignal) {
            try {
                await apiClient.put(`/colors/${color.id}`, colorsSchema.parse(color), { signal });
                await this.fetchColors();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteColor(id: number, signal?: AbortSignal) {
            try {
                await apiClient.delete(`/colors/${id}`, { signal });
                await this.refreshList();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async refreshList() {
            await this.fetchColors();
            await this.countColors();
        },
        async setPage(page: number) {
            this.currentPage = page;
            await this.fetchColors();
        },
        async setItemsPerPage(itemsPerPage: number) {
            this.itemsPerPage = itemsPerPage;
            await this.fetchColors();
        },
        async setSortBy(sortBy: any) {
            this.sortBy = sortBy;
            await this.fetchColors();
        },
    },
});