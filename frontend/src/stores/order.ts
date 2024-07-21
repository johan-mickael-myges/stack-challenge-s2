import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/config/axios'; 
import { Order } from '@/types';

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/api/user/orders');
      orders.value = response.data; // Assurez-vous que la réponse est au bon format
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
    } finally {
      loading.value = false;
    }
  };

  // Fetch orders on store initialization
  fetchOrders();

  return {
    orders,
    loading,
    error,
    fetchOrders,
  };
});
