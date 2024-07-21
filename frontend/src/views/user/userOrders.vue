<template>
  <div>
    <h2>Mes Commandes</h2>
    <v-list v-if="orderStore.orders.length > 0">
      <v-list-item v-for="order in orderStore.orders" :key="order.id">
        <v-list-item-content>
          <v-list-item-title>Commande {{ order.id }}</v-list-item-title>
          <v-list-item-subtitle>{{ order.paymentMethod }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-alert v-else type="info">Aucune commande n'est encore passée.</v-alert>
    <v-alert v-if="orderStore.error" type="error">{{ orderStore.error }}</v-alert>
    <v-progress-circular v-if="orderStore.loading" indeterminate></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrders(); // Fetch orders when component is mounted
});
</script>
