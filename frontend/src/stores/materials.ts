import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const materialSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Material = z.infer<typeof materialSchema>;

export const useMaterialStore = defineStore('materials', {
    state: () => ({
        loading: false,
        materials: [] as Material[],
    }),
    actions: {
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
    },
});