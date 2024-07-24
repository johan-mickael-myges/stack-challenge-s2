<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" class="mb-4">
          Pour toute demande de remboursement, veuillez contacter le service client à l'adresse suivante : 
          <a href="mailto:service-client@layalin.com" class="underline">service-client@layalin.com</a>.
          <br>
          Merci de préciser dans votre email les informations suivantes :
          <ul class="list-disc pl-5 mt-2">
            <li>Nom et prénom</li>
            <li>Adresse e-mail du compte qui a passé la commande</li>
            <li>Numéro de téléphone</li>
            <li>Référence de la commande</li>
            <li>Article à retourner</li>
            <li>Raison du retour</li>
          </ul>
          Nous vous invitons à consulter notre <a href="/refund-policy" class="underline">politique de retours et de remboursements</a>.
        </v-alert>
        <h1 class="text-2xl font-bold mb-4">Votre historique de commandes :</h1>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
        <div v-if="!loading && !error">
          <div v-if="paidOrders.length === 0">
            <p class="text-center text-lg">Vous n'avez pas encore effectué de commande.</p>
          </div>
          <div v-else>
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
                  <v-list-item-avatar class="mr-4">
                    <v-img :src="item.Product.thumbnail" alt="Image du Produit" max-width="75"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.Product.name }} x {{ item.quantity }}</v-list-item-title>
                    <v-list-item-subtitle>Prix Unitaire: {{ item.unitPrice }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Sous-total: {{ item.subtotal }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-card-actions>
                <v-btn @click="openInvoiceModal(order.id)">Voir la facture</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
    <InvoiceModal :show="showInvoice" :orderId="selectedOrderId" @update:show="showInvoice = $event" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/order';
import InvoiceModal from '@/components/Invoice/InvoiceModal.vue';

const orderStore = useOrderStore();

const loading = computed(() => orderStore.loading);
const error = computed(() => orderStore.error);
const paidOrders = computed(() => orderStore.paidOrders);

const showInvoice = ref(false);
const selectedOrderId = ref<number | null>(null);

const openInvoiceModal = (orderId: number) => {
  selectedOrderId.value = orderId;
  showInvoice.value = true;
};
onMounted(async () => {
  await orderStore.fetchPaidOrders();
});

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + parseFloat(item.unitPrice) * item.quantity, 0).toFixed(2);
};
</script>
