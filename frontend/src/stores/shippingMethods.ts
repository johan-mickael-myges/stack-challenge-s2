import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import {z} from 'zod';

const ShippingMethodSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    cost: z.union([z.number(), z.string()]),
    minEstimatedDeliveryTime: z.number().int().min(1, "Minimum delivery time must be at least 1 day"),
    maxEstimatedDeliveryTime: z.number().int().min(1, "Maximum delivery time must be at least 1 day"),
});

const AmountForPaypalSchema = z.object({
    currency_code: z.string(),
    value: z.string(),
});

const ShippingMethodForPaypalSchema = z.object({
    id: z.number().int(),
    label: z.string(),
    type: z.string(),
    selected: z.boolean(),
    amount: AmountForPaypalSchema,
});

const ShippingMethodsForPaypalSchema = z.array(ShippingMethodForPaypalSchema);

const ShippingMethodsSchema = z.array(ShippingMethodSchema);

export type ShippingMethod = z.infer<typeof ShippingMethodSchema>;
export type ShippingMethods = z.infer<typeof ShippingMethodsSchema>;

export type ShippingMethodForPaypal = z.infer<typeof ShippingMethodForPaypalSchema>;
export type ShippingMethodsForPaypal = z.infer<typeof ShippingMethodsForPaypalSchema>;

export const useShippingMethodStore = defineStore('shippingMethods', {
    state: () => ({
        selectedShippingMethod: null as ShippingMethod | null,
        shippingMethods: [] as ShippingMethods,
        loading: false,
    }),
    actions: {
        clearState() {
            this.selectedShippingMethod = null;
            this.shippingMethods = [];
            this.loading = false;
        },
        async fetchShippingMethods() {
            this.loading = true;
            try {
                const response = await apiClient.get('/shipping-methods');
                this.shippingMethods = response.data;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        setSelectedShippingMethod(shippingMethod: ShippingMethod) {
            this.selectedShippingMethod = shippingMethod;
        },
    },
    getters: {
        getSelectedShippingMethod(): ShippingMethod | null {
            return this.selectedShippingMethod;
        },
        getShippingMethods(): ShippingMethods {
            return this.shippingMethods;
        },
        isLoading(): boolean {
            return this.loading;
        },
        generateShippingMethodOptions(): ShippingMethodsForPaypal {
            return this.shippingMethods.map((shippingMethod: ShippingMethod) => {
                return {
                    id: shippingMethod.id,
                    label: shippingMethod.name,
                    type: 'SHIPPING',
                    selected: shippingMethod.id == this.selectedShippingMethod?.id,
                    amount: {
                        currency_code: 'EUR',
                        value: shippingMethod.cost.toString(),
                    },
                };
            });
        }
    },
});
