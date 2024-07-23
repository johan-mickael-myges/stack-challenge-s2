<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-2xl font-bold mb-4">Votre historique de commandes:</h1>
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
          <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
          <div v-if="!loading && !error">
            <v-card
              v-for="order in paidOrders"
              :key="order.id"
              class="mb-4"
            >
              <v-card-title>Commande ref: {{ order.id }}</v-card-title>
              <v-card-subtitle>Méthode de Paiement: {{ order.paymentMethod }}</v-card-subtitle>
              <v-card-subtitle>Date: {{ order.createdAt }}</v-card-subtitle>
              <v-card-subtitle>Total: {{ calculateTotal(order.OrderItems) }}</v-card-subtitle>
              <v-divider></v-divider>
              <v-list>
                <v-list-item
                  v-for="item in order.OrderItems"
                  :key="item.id"
                  class="align-start"
                >
                  <v-list-item-avatar>
                    <v-img :src="item.Product.thumbnail" alt="Image du Produit" max-width="75"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.Product.name }} x {{ item.quantity }}</v-list-item-title>
                    <v-list-item-subtitle>Prix Unitaire: {{ item.unitPrice }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Sous-total: {{ item.subtotal }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import { useOrderStore } from '@/stores/order';
  
  const orderStore = useOrderStore();
  
  const loading = computed(() => orderStore.loading);
  const error = computed(() => orderStore.error);
  const paidOrders = computed(() => orderStore.paidOrders);
  
  onMounted(async () => {
    await orderStore.fetchPaidOrders();
  });
  
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.unitPrice) * item.quantity, 0).toFixed(2);
  };
  </script>
  
  <style scoped>
  .v-list-item-avatar {
    margin-right: 16px;
  }
  </style>
  