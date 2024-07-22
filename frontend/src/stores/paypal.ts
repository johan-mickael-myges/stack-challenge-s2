import { defineStore } from 'pinia';
import apiClient from "@/config/axios.ts";

export const usePayPalStore = defineStore('paypal', {
    state: () => ({
        loading: false,
        paypalClientId: null as string | null,
    }),
    actions: {
        async fetchPayPalClientId() {
            this.loading = true;
            try {
                const response = await apiClient.get('configs/paypal-client');
                this.paypalClientId = response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createOrder(totalPrice: number) {
            try {
                const response = await apiClient.post('payments/create', { totalPrice }, {
                    withCredentials: true,
                });
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        async captureOrder(orderID: string, internalOrderId: string) {
            try {
                const response = await apiClient.post('payments/capture', {
                    orderID,
                    internalOrderId,
                }, {
                    withCredentials: true,
                });
                return response.data;
            } catch (error) {
                console.error('Failed to capture PayPal order:', error);
                throw error;
            }
        },
    },
});