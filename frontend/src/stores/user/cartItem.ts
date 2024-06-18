import { defineStore } from 'pinia';
import apiClient from '@/config/axios';
import { z } from 'zod';

const cartItemSchema = z.object({
  id: z.number().optional(),
  productId: z.number(),
  quantity: z.number(),
});

// Define types
export type CartItem = z.infer<typeof cartItemSchema>;

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[],
  }),
  actions: {
    async addToCart(productId: number, quantity: number = 1) {
      try {
        const response = await apiClient.post('/user/cart/add', {
          productId,
          quantity,
        });

        const newCartItem = cartItemSchema.parse(response.data);
        this.cartItems.push(newCartItem);

        console.log('Item successfully added to cart:', newCartItem);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
      }
    },

    async getCart() {
      try {
        console.log('Fetching cart items...');

        const response = await apiClient.get('/api/user/cart');
        this.cartItems = response.data;

        console.log('Cart items fetched successfully:', this.cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
    },

    async removeFromCart(cartItemId: number) {
      try {
        console.log(`Removing item ${cartItemId} from cart...`);

        await apiClient.delete(`/api/user/cart/item/${cartItemId}`);
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);

        console.log('Item removed from cart. Updated cart items:', this.cartItems);
      } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
      }
    },

    async updateCartItem(cartItemId: number, quantity: number) {
      try {
        console.log(`Updating item ${cartItemId} in cart with quantity ${quantity}...`);

        const response = await apiClient.put(`/api/user/cart/item/${cartItemId}`, { quantity });
        const updatedCartItem = cartItemSchema.parse(response.data);

        const index = this.cartItems.findIndex(item => item.id === cartItemId);
        if (index !== -1) {
          this.cartItems[index] = updatedCartItem;
        }

        console.log('Item updated in cart. Updated cart items:', this.cartItems);
      } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
      }
    },
  },
});
