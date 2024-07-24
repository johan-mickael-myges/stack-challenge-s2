<template>
    <v-dialog :model-value="show" @update:model-value="updateShow" max-width="600px">
      <v-card>
        <v-card-title class="headline">Facture</v-card-title>
        <v-card-text>
          <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <p>Commande ref: {{ order.id }}</p>
            <p>Date: {{ order.createdAt }}</p>
            <p>Total: {{ calculateTotal(order.OrderItems) }} €</p>
            <v-list>
              <v-list-item
                v-for="item in order.OrderItems"
                :key="item.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.Product.name }} x {{ item.quantity }}</v-list-item-title>
                  <v-list-item-subtitle>Prix Unitaire: {{ item.unitPrice }} €</v-list-item-subtitle>
                  <v-list-item-subtitle>Sous-total: {{ item.subtotal }} €</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="downloadInvoice">Télécharger la facture</v-btn>
          <v-btn color="secondary" @click="closeModal">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useOrderStore } from '@/stores/order';
  
  const props = defineProps({
    show: Boolean,
    orderId: Number,
  });
  
  const emit = defineEmits(['update:show']);
  
  const orderStore = useOrderStore();
  
  const order = computed(() => orderStore.paidOrders.find(o => o.id === props.orderId));
  const loading = computed(() => orderStore.loading);
  
  const updateShow = (value: boolean) => {
    emit('update:show', value);
  };
  
  const closeModal = () => {
    emit('update:show', false);
  };
  
  const downloadInvoice = async () => {
    await orderStore.fetchInvoice(props.orderId);
  };
  
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.unitPrice) * item.quantity, 0).toFixed(2);
  };
  </script>
  