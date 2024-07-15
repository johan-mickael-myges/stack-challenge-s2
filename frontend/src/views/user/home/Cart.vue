<template>
    <div class="cart-page">
      <h1 class="text-lg mb-4 font-semibold">Votre panier</h1>
      <div v-if="loading" class="text-center">
        <v-progress-circular color="black" indeterminate></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="cartIsEmpty">
          <p>Votre panier est vide.</p>
        </div>
        <div v-else>
          <div v-for="item in cart.CartItems" :key="item.id" class="cart-item">
            <v-card>
              <v-img :src="cartItemHasImage(item) ? item.Product.images[0] : notFoundImage" class="cart-item-image"></v-img>
              <v-card-title>{{ item.Product.name }}</v-card-title>
              <v-card-subtitle>{{ item.Product.price }} €</v-card-subtitle>
              <v-card-text>
                Quantité: {{ item.quantity }}
                <v-btn icon @click="removeProductFromCart(item.Product.id)">
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
  import {computed, defineComponent, onMounted} from 'vue';
  import notFoundImage from '@/assets/not-found-image.png';
  import {useCartStore} from "@/stores/cart.ts";
  
  export default defineComponent({
    name: 'Cart',
    data() {
      return {
        notFoundImage,
      };
    },
    setup() {
      const store = useCartStore();

      const loading = computed(() => store.loading);
      const cart = computed(() => store.cart);

      const fetchCart = store.fetchCart;
      const removeProductFromCart = store.removeProductFromCart;

      const cartIsEmpty = computed(() => {
        return !cart.value || !cart.value.CartItems || cart.value.CartItems.length === 0;
      });

      onMounted(async () => {
        await fetchCart();
      });
  
      return {
        cartIsEmpty,
        cart,
        loading,
        removeProductFromCart,
      };
    },
    methods: {
      cartItemHasImage(item: any) {
        return item.Product && item.Product.images && item.Product.images.length > 0;
      },
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
  