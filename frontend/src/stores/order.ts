import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';
import {DeliveryEntity, DeliveryEntitySchema} from "@/stores/delivery.ts";

const ProductSchema = z.object({
    price: z.number(),
    id: z.number(),
    name: z.string(),
    reference: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    images: z.array(z.string()),
    weight: z.number(),
    brandId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const OrderItemSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    unitPrice: z.string(),
    subtotal: z.string(),
    orderId: z.number(),
    productId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    Product: ProductSchema,
});

const CreatedOrderSchema = z.object({
    id: z.number(),
    userId: z.number(),
    paymentMethod: z.string(),
    paymentStatus: z.string(),
    updatedAt: z.string(),
    createdAt: z.string(),
    OrderItems: z.array(OrderItemSchema),
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
        delivery: null as DeliveryEntity | null,
        paidOrders: [] as CreatedOrders,
        error: null as string | null,
    }),
    actions: {
        async fetchDelivery(orderId: number) {
            this.loading = true;
            try {
                const response = await apiClient.get(`/orders/${orderId}/delivery`);
                DeliveryEntitySchema.parse(response.data);
                this.delivery = response.data;
            } catch(error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
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
        async fetchPaidOrders() {
            try {
                this.loading = true;
                this.error = null;
                const response = await apiClient.get('/orders/history', {
                    withCredentials: true,
                });
                console.log('Fetched paid orders:', response.data);
                this.paidOrders = CreatedOrdersSchema.parse(response.data);
            } catch (error) {
                this.error = 'Failed to fetch paid orders';
                console.error('Error fetching paid orders:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                }
            } finally {
                this.loading = false;
            }
        },
    },
});
