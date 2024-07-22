<template>
  <v-container class="cart-page py-4">
    <v-row>
      <v-col cols="12">
        <h1 class="text-lg mb-4 font-semibold">Mon Panier: </h1>
      </v-col>
      <v-col v-if="loading" cols="12" class="text-center">
        <v-progress-circular color="black" indeterminate></v-progress-circular>
      </v-col>
      <v-col v-else cols="12" class="d-flex">
        <!-- Product List -->
        <v-col cols="8">
          <div v-if="cartIsEmpty" class="p-4 bg-white rounded shadow">
            <p>Votre panier est actuellement vide.</p>
          </div>
          <div v-else>
            <div v-for="item in cart.CartItems" :key="item.id" class="cart-item mb-4">
              <v-card class="d-flex align-center p-4 relative">
                <v-img :src="item.Product.thumbnail" class="cart-item-image mr-4"></v-img>
                <v-card-text class="d-flex flex-column justify-center">
                  <v-card-title>{{ item.Product.name }}</v-card-title>
                  <v-card-subtitle>L'unité: {{ item.Product.price }} €</v-card-subtitle>
                  <v-card-subtitle>Le total: {{ item.Product.price * item.quantity }} €</v-card-subtitle>
                </v-card-text>
                <v-btn icon class="delete-button" @click.prevent="removeProductFromCart(item.Product.id)">
                  <v-icon size="20px">mdi-delete</v-icon>
                </v-btn>
                <v-select
                  :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  v-model="item.quantity"
                  label="Quantité"
                  class="small-select rounded-select quantity-select"
                  @change="updateQuantity(item.Product.id, item.quantity)"
                ></v-select>
              </v-card>
            </div>
          </div>
        </v-col>
        <!-- Summary Box -->
        <v-col cols="4">
          <v-card class="p-4 bg-white rounded shadow d-flex flex-column justify-space-between">
            <div>
              <p class="text-lg font-semibold">Résumé de la commande</p>
              <p>Sous-total: {{ totalPrice }} €</p>
              <p>Livraison: (à ajouter)</p>
              <p class="font-bold">Total: {{ totalPrice }} €</p>
            </div>
            <div>
              <v-btn class="mb-4" color="primary" block @click="proceedToCheckout">Passer la commande</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCartStore } from "@/stores/cart.ts";
import {useOrderStore} from "@/stores/order.ts";

export default defineComponent({
  name: 'Cart',
  setup() {
    const store = useCartStore();
    const orderStore = useOrderStore();

    const router = useRouter();

    const loading = computed(() => store.loading);
    const cart = computed(() => store.cart);
    const totalPrice = computed(() => store.cartTotal);

    const fetchCart = store.fetchCart;
    const removeProductFromCart = store.removeProductFromCart;
    const updateCartItemQuantity = store.updateCartItemQuantity;

    const cartIsEmpty = computed(() => {
      return !cart.value || !cart.value.CartItems || cart.value.CartItems.length === 0;
    });

    const fetchCartItems = async () => {
      try {
        await fetchCart();
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
      if (quantity < 1) return;
      await updateCartItemQuantity(productId, quantity);
    };

    const proceedToCheckout = async () => {
      try {
        const order = await orderStore.createOrder(store.items, 'PAYPAL');
        // Redirect to the order details page
        router.push({ name: 'OrderDetails', params: {
          orderId: order.data.id,
        } });
      } catch (error) {
        console.error('Failed to create order:', error);
        alert('Failed to proceed to checkout.');
      }
    };

    onMounted(() => {
      fetchCartItems();
    });

    return {
      cart,
      cartIsEmpty,
      loading,
      totalPrice,
      removeProductFromCart,
      updateQuantity,
      proceedToCheckout,
    };
  },
});
</script>

<style scoped>
.cart-page {
  padding: 20px;
}
.cart-item {
  margin-bottom: 20px;
  position: relative;
}
.cart-item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
.small-select {
  max-width: 100px;
}
.rounded-select .v-input__control {
  border-radius: 12px !important;
}
.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
}
.quantity-select {
  position: absolute;
  bottom: 2px;
  right: 8px;
}
.v-card {
  display: flex;
  align-items: center;
}
</style>
