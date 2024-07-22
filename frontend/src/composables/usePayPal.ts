import {ref, nextTick, onMounted} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.ts';
import {usePayPalStore} from "@/stores/paypal.ts";

export const usePayPal = () => {
  const paypalLoaded = ref(false);
  const router = useRouter();
  const cartStore = useCartStore();
  const paypalStore = usePayPalStore();

  onMounted(async () => {
    await paypalStore.fetchPayPalClientId();
  });

  const loadPayPalScript = async (setupPayPalButton: Function) => {
    if (document.getElementById('paypal-sdk')) {
      await nextTick();
      setupPayPalButton();
      return;
    }

    try {
      const PAYPAL_CLIENT_ID = paypalStore.paypalClientId;

      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR`;
      script.onload = () => {
        setupPayPalButton();
      };
      script.onerror = () => {
        console.error('Failed to load PayPal script');
      };
      document.body.appendChild(script);
    } catch (error) {
      throw error;
    }
  };

  const setupPayPalButton = (totalPrice: number, internalOrderId: string) => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            const response = await paypalStore.createOrder(totalPrice);
            return response.data;
          } catch (err) {
            throw err;
          }
        },
        onApprove: async (data) => {
          try {
            const response = await paypalStore.capturePayPalOrder(data.orderID, internalOrderId);
            alert('Transaction completed!');
            await cartStore.clearCart();
            router.push({ name: 'OrderConfirmation' });
          } catch (err) {
            alert('Failed to complete transaction.');
          }
        },
        onError: (err) => {
          console.error('PayPal Button error:', err);
          alert('An error occurred during the transaction.');
        }
      }).render('#paypal-button-container');
    }
  };

  return {
    paypalLoaded,
    loadPayPalScript,
    setupPayPalButton,
  };
};
