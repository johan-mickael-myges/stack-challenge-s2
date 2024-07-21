<template>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>User Orders</v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.paymentMethod }}</td>
                    <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
                    <td>{{ order.total }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const orders = ref([]);
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      orders.value = response.data;
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };
  
  onMounted(() => {
    fetchOrders();
  });
  </script>
  
  <style scoped>
  </style>
  