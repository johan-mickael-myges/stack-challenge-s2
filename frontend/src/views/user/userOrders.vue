<template>
  <div>
    <h2>Mes Commandes</h2>
    <v-list>
      <v-list-item v-for="order in orders" :key="order.id">
        <v-list-item-content>
          <v-list-item-title>Commande {{ order.id }}</v-list-item-title>
          <v-list-item-subtitle>{{ order.paymentMethod }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Order } from '@/types'; 

const orders = ref<Order[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get('/api/user/orders');
    orders.value = response.data as Order[]; 
  } catch (error) {
    console.error(error);
  }
});
</script>
