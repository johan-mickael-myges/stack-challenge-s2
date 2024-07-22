import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';
import { PAYMENT_METHOD_PAYPAL, PAYMENT_METHOD_STRIPE } from '@/constants/paymentMethod';

const CreatedOrderSchema = z.object({
    id: z.number(),
    userId: z.number(),
    paymentMethod: z.string(),
    updatedAt: z.string(),
    createdAt: z.string(),
});

const ItemSchema = z.object({
    productId: z.number(),
    quantity: z.number().min(1),
});

const ItemsSchema = z.array(ItemSchema);

const PaymentMethodSchema = z.union([
    z.literal(PAYMENT_METHOD_PAYPAL),
    z.literal(PAYMENT_METHOD_STRIPE),
]);

export const CreateOrderSchema = z.object({
    items: z.array(ItemSchema),
    paymentMethod: PaymentMethodSchema,
});

export const useOrderStore = defineStore('orders', {
    state: () => ({
        loading: false,
    }),
    actions: {
        async createOrder(
            items: z.infer<typeof ItemsSchema>,
            paymentMethod: z.infer<typeof PaymentMethodSchema>
        ): Promise<z.infer<typeof CreatedOrderSchema>> {
            try {
                CreateOrderSchema.parse({ items, paymentMethod });

                this.loading = true;
                return await apiClient.post('/orders', {
                    items,
                    paymentMethod,
                });
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
