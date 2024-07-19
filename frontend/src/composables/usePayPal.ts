import { ref, nextTick } from 'vue';
import axios from 'axios';

export const usePayPal = () => {
  const paypalLoaded = ref(false);

  const loadPayPalScript = async (setupPayPalButton: Function) => {
    if (document.getElementById('paypal-sdk')) {
      await nextTick();
      setupPayPalButton();
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/config/paypal-client-id');
      if (response.status !== 200 || !response.data.clientId) {
        throw new Error('Failed to fetch PayPal client ID');
      }
      const PAYPAL_CLIENT_ID = response.data.clientId;

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
      console.error('Failed to load PayPal script:', error);
    }
  };

  const setupPayPalButton = (totalPrice: number) => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: async (data: any, actions: any) => {
          try {
            const response = await axios.post('http://localhost:8000/payment/create-order', { totalPrice }, {
              withCredentials: true,
            });
            return response.data.orderID;
          } catch (err) {
            console.error('Failed to create PayPal order:', err);
            throw err;
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const response = await axios.post('http://localhost:8000/payment/capture-order', { orderID: data.orderID }, {
              withCredentials: true,
            });
            alert('Transaction completed!');
          } catch (err) {
            console.error('Failed to capture PayPal order:', err);
            alert('Failed to complete transaction.');
          }
        },
        onError: (err: any) => {
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
