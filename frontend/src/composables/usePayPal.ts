import { ref, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.ts';

export const usePayPal = () => {
  const paypalLoaded = ref(false);
  const router = useRouter();
  const cartStore = useCartStore();

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

  // const setupPayPalButton = (totalPrice: number, orderId: string, recipientFirstName: string, recipientLastName: string, address: string, shippingMethod: string) => {
  //   if (window.paypal) {
  //     window.paypal.Buttons({
  //       createOrder: async (data, actions) => {
  //         try {
  //           const response = await axios.post('http://localhost:8000/payment/create-order', { totalPrice }, {
  //             withCredentials: true,
  //           });
  //           return response.data.orderID;
  //         } catch (err) {
  //           console.error('Failed to create PayPal order:', err);
  //           throw err;
  //         }
  //       },
  //       onApprove: async (data, actions) => {
  //         try {
  //           alert('Transaction approved!');
  //           const response = await axios.post('http://localhost:8000/payment/capture-order', {
  //             orderID: data.orderID,
  //             localOrderId: orderId,
  //           }, {
  //             withCredentials: true,
  //           });
  //           // Send delivery information after payment approval
  //           const fullName = `${recipientFirstName} ${recipientLastName}`;
  //           console.log(data);
  //           await axios.post('http://localhost:8000/orders/update-delivery', {
  //             orderId,
  //             shippingMethod,
  //             address,
  //             recipientName: fullName,
  //           }, {
  //             withCredentials: true,
  //           });
  //           alert('Transaction completed!');
  //           // Clear the cart
  //           await cartStore.clearCart();
  //           // Redirect to order confirmation page
  //           router.push({ name: 'OrderConfirmation' });
  //         } catch (err) {
  //           console.error('Failed to capture PayPal order:', err);
  //           alert('Failed to complete transaction.');
  //         }
  //       },
  //       onError: (err) => {
  //         console.error('PayPal Button error:', err);
  //         alert('An error occurred during the transaction.');
  //       }
  //     }).render('#paypal-button-container');
  //   }
  // };

  const setupPayPalButton = (totalPrice: number, orderId: string, recipientFirstName: string, recipientLastName: string, address: string, shippingMethod: string) => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: async (data, actions) => {
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
        onApprove: async (data, actions) => {
          try {
            alert('Transaction approved!');
            const response = await axios.post('http://localhost:8000/payment/capture-order', {
              orderID: data.orderID,
              localOrderId: orderId,
            }, {
              withCredentials: true,
            });
            // Send delivery information after payment approval
            const fullName = `${recipientFirstName} ${recipientLastName}`;
            console.log(data);
            await axios.post('http://localhost:8000/orders/update-delivery', {
              orderId,
              shippingMethod,
              address,
              recipientName: fullName,
            }, {
              withCredentials: true,
            });
            alert('Transaction completed!');
            // Clear the cart
            await cartStore.clearCart();
            // Redirect to order confirmation page
            router.push({ name: 'OrderConfirmation' });
          } catch (err) {
            console.error('Failed to capture PayPal order:', err);
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
