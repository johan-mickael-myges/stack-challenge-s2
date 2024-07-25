import {defineStore} from 'pinia';
import apiClient from "@/config/axios.ts";
import {z} from 'zod';

export const AlertItemPreferenceSchema = z.object({
    id: z.number(),
    itemId: z.number(),
});
export type AlertItemPreference = z.infer<typeof AlertItemPreferenceSchema>;

export const AlertSchema = z.object({
    description: z.string(),
});
export type Alert = z.infer<typeof AlertSchema>;

export const AlertPreferencesSchema = z.object({
    id: z.number(),
    alertId: z.number(),
    enabled: z.boolean(),
    alert: AlertSchema,
    alertItemPreferences: z.array(AlertItemPreferenceSchema),
});
export type AlertPreferences = z.infer<typeof AlertPreferencesSchema>;


export const NewsletterSchema = z.object({
    id: z.number(),
    alertId: z.number(),
    enabled: z.boolean(),
    alert: AlertSchema,
    alertItemPreferences: z.array(AlertItemPreferenceSchema),

});

export const useAlertStore = defineStore('alerts', {
    state() {
        return {
            loading: false,
            error: '',
            alertPreferences: null as AlertPreferences | null,
        }
    },

    actions: {
        clearState() {
            this.loading = false;
            this.error = '';
            this.alertPreferences = null;
        },
        async getAlertPreference(alertId: number) {
            this.loading = true;
            try {
                const response = await apiClient.get(`/alerts/preferences/${alertId}`);
                return response.data;
            } catch (error) {
                this.error = error.response.data.message;
            }
            this.loading = false;
        },
        async saveAlertPreference(alertId: number, enabled: boolean) {
            this.loading = true;
            try {
                const response = await apiClient.post(`/alerts/preferences`, {
                    alertId,
                    enabled,
                });
                return response.data;
            } catch (error) {
                this.error = error.response.data.message;
            }
            this.loading = false;
        },
        async saveAlertItemPreference(alertId: number, items, enabled: boolean) {
            this.loading = true;
            try {
                const response = await apiClient.post(`/alerts/items-preferences`, {
                    userAlertPreferenceId: alertId,
                    items,
                    enabled,
                });
                return response.data;
            } catch (error) {
                this.error = error.response.data.message;
            }
            this.loading = false;
        }
    },
});