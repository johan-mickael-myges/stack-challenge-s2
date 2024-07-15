import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const productSchema = z.object({
    id: z.number(),
    price: z.number(),
    name: z.string(),
    reference: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    quantity: z.number(),
    brandId: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const baseCartItemSchema = z.object({
    id: z.number(),
    cartId: z.number(),
    productId: z.number(),
    quantity: z.number().default(1),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const cartItemSchema = z.object({
    id: z.number(),
    cartId: z.number(),
    productId: z.number(),
    quantity: z.number().default(1),
    createdAt: z.string(),
    updatedAt: z.string(),
    Product: productSchema,
});

const cartSchema = z.object({
    id: z.number(),
    userId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    CartItems: z.array(cartItemSchema),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;

export const useCartStore = defineStore('carts', {
    state: () => ({
        loading: false,
        cart: null as Cart | null,
    }),
    actions: {
        async addToCart(productId: number, userId: number, quantity: number = 1, signal?: AbortSignal) {
            this.loading = true;
            try {
                const response = await apiClient.post('/carts', { productId, userId, quantity }, { signal });
                const newCartItem = baseCartItemSchema.parse(response.data);
                await this.fetchCart();
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async fetchCart() {
            this.loading = true;
            try {
                const response = await apiClient.get(`/carts`);
                this.cart = cartSchema.parse(response.data);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async removeProductFromCart(productId: number, signal?: AbortSignal) {
            this.loading = true;
            try {
                await apiClient.delete(`/carts/${productId}`, { signal });
                // Remove the item from the cart
                if (this.cart) {
                    this.cart.CartItems = this.cart.CartItems.filter((item) => item.productId !== productId);
                    console.log(this.cart.CartItems);
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
});
