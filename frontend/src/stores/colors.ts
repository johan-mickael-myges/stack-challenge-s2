import {defineStore} from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const colorSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
});

export type Color = z.infer<typeof colorSchema>;

export const useColorStore = defineStore('colors', {
    state: () => ({
        loading: false,
        colors: [] as Color[],
    }),
    actions: {
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
    },
});