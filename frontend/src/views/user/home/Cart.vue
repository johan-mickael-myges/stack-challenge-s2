<template>
    <div class="cart-page">
      <h1 class="text-lg mb-4 font-semibold">Votre panier</h1>
      <div v-if="isLoading" class="text-center">
        <v-progress-circular color="black" indeterminate></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="cartItems.length === 0">
          <p>Votre panier est vide.</p>
        </div>
        <div v-else>
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <v-card>
              <v-img :src="item.Product.images.length ? item.Product.images[0] : notFoundImage" class="cart-item-image"></v-img>
              <v-card-title>{{ item.Product.name }}</v-card-title>
              <v-card-subtitle>{{ item.Product.price }} €</v-card-subtitle>
              <v-card-text>
                Quantité: {{ item.quantity }}
                <v-btn icon @click="removeFromCart(item.Product.id)">
                  <v-icon size="20px">mdi-delete</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  import notFoundImage from '@/assets/not-found-image.png';
  
  interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
  }
  
  interface CartItem {
    id: number;
    quantity: number;
    Product: Product;
  }
  
  export default defineComponent({
    name: 'Cart',
    data() {
      return {
        isLoading: true,
        notFoundImage,
        cartItems: [] as CartItem[]
      };
    },
    setup() {
      const cartItems = ref<CartItem[]>([]);
      const isLoading = ref(true);
      const userId = 1; // Dummy user ID for now
  
      const fetchCartItems = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/cart/${userId}`);
          cartItems.value = response.data.CartItems;
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const removeFromCart = async (productId: number) => {
        try {
          await axios.delete(`http://localhost:8000/cart/${userId}/${productId}`);
          // Remove the item from the cartItems array
          cartItems.value = cartItems.value.filter(item => item.Product.id !== productId);
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
        }
      };
  
      onMounted(fetchCartItems);
  
      return {
        cartItems,
        isLoading,
        removeFromCart
      };
    }
  });
  </script>
  
  <style scoped>
  .cart-page {
    padding: 20px;
  }
  .cart-item {
    margin-bottom: 20px;
  }
  .cart-item-image {
    width: 100px;
    height: 100px;
  }
  </style>
  