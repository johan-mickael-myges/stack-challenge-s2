<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Détails de la commande</h1>
        <div v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <div v-if="error" class="error">
            <p>Erreur lors de la récupération des détails de la commande.</p>
          </div>
          <div v-else>
            <p><strong>Numéro de commande:</strong> {{ order.id }}</p>
            <p><strong>Mode de paiement:</strong> {{ order.paymentMethod }}</p>
            <p><strong>Date:</strong> {{ order.createdAt }}</p>
            <div v-for="item in order.OrderItems" :key="item.id">
              <p><strong>Produit:</strong> {{ item.Product.name }}</p>
              <p><strong>Quantité:</strong> {{ item.quantity }}</p>
              <p><strong>Prix unitaire:</strong> {{ item.unitPrice }} €</p>
              <p><strong>Sous-total:</strong> {{ item.subtotal }} €</p>
            </div>
            <p class="font-bold">Total: {{ totalPrice.toFixed(2) }} €</p>
            <div id="paypal-button-container"></div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { usePayPal } from '@/composables/usePayPal';
import useOrderDetails from '@/composables/useOrderDetails';

export default defineComponent({
  name: 'OrderDetails',
  setup() {
    const route = useRoute();
    const orderId = route.params.orderId as string;
    const { order, loading, error, totalPrice, fetchOrderDetails } = useOrderDetails(orderId);

    const { loadPayPalScript, setupPayPalButton } = usePayPal();

    onMounted(async () => {
      await fetchOrderDetails();
      nextTick(() => {
        loadPayPalScript(() => setupPayPalButton(totalPrice.value, orderId));
      });
    });

    return {
      order,
      loading,
      error,
      totalPrice,
    };
  },
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
