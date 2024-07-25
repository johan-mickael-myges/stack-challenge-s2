import { ref } from 'vue';
import axios from 'axios';
import apiClient from "@/config/axios.ts";

export default function useOrderDetails(orderId: string) {
  const order = ref<any>(null);
  const loading = ref(true);
  const error = ref(null);
  const totalPrice = ref(0);

  const fetchOrderDetails = async () => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      order.value = response.data;
      totalPrice.value = response.data.OrderItems.reduce((sum: number, item: any) => sum + parseFloat(item.subtotal), 0);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    order,
    loading,
    error,
    totalPrice,
    fetchOrderDetails,
  };
}
