import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const CreatedOrderSchema = z.object({
    id: z.number(),
    userId: z.number(),
    paymentMethod: z.string(),
    updatedAt: z.string(),
    createdAt: z.string(),
});

const CreatedOrdersSchema = z.array(CreatedOrderSchema);

const ItemSchema = z.object({
    productId: z.number(),
    quantity: z.number().min(1),
});

const ItemsSchema = z.array(ItemSchema);

export type CreatedOrder = z.infer<typeof CreatedOrderSchema>;
export type CreatedOrders = z.infer<typeof CreatedOrdersSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type Items = z.infer<typeof ItemsSchema>;

export const useOrderStore = defineStore('orders', {
    state: () => ({
        loading: false,
    }),
    actions: {
        async createOrder(
            items: z.infer<typeof ItemsSchema>,
        ): Promise<CreatedOrder> {
            try {
                ItemsSchema.parse(items);

                this.loading = true;
                return await apiClient.post('/orders', {
                    items,
                });
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
