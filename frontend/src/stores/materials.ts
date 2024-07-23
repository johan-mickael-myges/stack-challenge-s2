import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const materialsSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Material = z.infer<typeof materialsSchema>;

export const useMaterialStore = defineStore('materials', {
    state: () => ({
        loading: false,
        materials: [] as Material[],
        material: null as Material | null,
        total: 0,
        currentPage: 1,
        itemsPerPage: 10,
        sortBy: [] as any
    }),
    actions: {
        async countMaterials() {
            try {
                const response = await apiClient.get('/materials/count');
                this.total = response.data;
            } catch (error) {
                throw error;
            }
        },
        async fetchMaterials() {
            this.loading = true;
            try {
                const response = await apiClient.get('/materials');
                this.materials = response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchMaterial(id: number) {
            try {
                const response = await apiClient.get(`/materials/${id}`);
                this.material = materialsSchema.parse(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async createMaterial(material: Material, signal?: AbortSignal) {
            try {
                const response = await apiClient.post('/materials', materialsSchema.parse(material), { signal });
                this.materials.push(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async updateMaterial(material: Material, signal?: AbortSignal) {
            try {
                await apiClient.put(`/materials/${material.id}`, materialsSchema.parse(material), { signal });
                await this.fetchMaterials();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteMaterial(id: number, signal?: AbortSignal) {
            try {
                await apiClient.delete(`/materials/${id}`, { signal });
                await this.refreshList();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async refreshList() {
            await this.fetchMaterials();
            await this.countMaterials();
        },
        async setPage(page: number) {
            this.currentPage = page;
            await this.fetchMaterials();
        },
        async setItemsPerPage(itemsPerPage: number) {
            this.itemsPerPage = itemsPerPage;
            await this.fetchMaterials();
        },
        async setSortBy(sortBy: any) {
            this.sortBy = sortBy;
            await this.fetchMaterials();
        },
    },
});