<template>
    <v-dialog :model-value="show" @update:model-value="updateShow" max-width="600px">
      <v-card>
        <v-card-title class="headline">Facture</v-card-title>
        <v-card-text>
          <div>
            <p>Layalin</p>
            <p>242 Rue du Faubourg Saint-Antoine, 75012 Paris</p>
            <p>Email: <a href="mailto:service-client@layalin.com">service-client@layalin.com</a></p>
            <p>Téléphone: 01 56 06 90 41</p>
          </div>
          <v-divider class="my-4"></v-divider>
          <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <p>Commande ref: {{ invoice.id }}</p>
            <p>Date: {{ invoice.createdAt }}</p>
            <p>Paiement Methode: {{ invoice.paymentMethod }}</p>
            <p>
              Adresse de livraison:
              {{ invoice.Delivery ? `${invoice.Delivery.firstName} ${invoice.Delivery.lastName}, ${invoice.Delivery.address}` : 'N/A' }}
            </p>
            <p>Total: {{ calculateTotal(invoice.OrderItems) }} €</p>
            <v-list>
              <v-list-item
                v-for="item in invoice.OrderItems"
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
  import { ref, computed, watch } from 'vue';
  import { useOrderStore } from '@/stores/order';
  
  const props = defineProps({
    show: Boolean,
    orderId: Number,
  });
  
  const emit = defineEmits(['update:show']);
  
  const orderStore = useOrderStore();
  
  const loading = computed(() => orderStore.loading);
  const invoice = ref(null);
  
  const fetchInvoice = async () => {
    if (props.orderId) {
      await orderStore.fetchInvoiceDetails(props.orderId);
      invoice.value = orderStore.invoice;
    }
  };
  
  const updateShow = (value: boolean) => {
    emit('update:show', value);
  };
  
  const closeModal = () => {
    emit('update:show', false);
  };
  
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.unitPrice) * item.quantity, 0).toFixed(2);
  };
  
  const downloadInvoice = async () => {
    await orderStore.fetchInvoice(props.orderId);
  };
  
  watch(() => props.show, (newVal) => {
    if (newVal) {
      fetchInvoice();
    }
  });
  </script>
  