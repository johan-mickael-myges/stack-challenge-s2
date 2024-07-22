<template>
  <div id="paypal-button-container"></div>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, ref, PropType} from 'vue';
import {usePayPalStore} from '@/stores/paypal';
import {useCartStore} from '@/stores/cart';
import {useRouter} from 'vue-router';

export default defineComponent({
  name: 'PayPalButton',
  props: {
    totalPrice: {
      type: Number,
      required: true,
    },
    internalOrderId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'paypal',
    },
  },
  setup(props) {
    const paypalStore = usePayPalStore();
    const cartStore = useCartStore();
    const router = useRouter();

    const loadPayPalScript = async (clientId: string) => {
      if (document.getElementById('paypal-sdk')) {
        await nextTick();
        setupPayPalButton();
        return;
      }

      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.onload = setupPayPalButton;
      document.body.appendChild(script);
    };

    const setupPayPalButton = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: async (data: any, actions: any) => {
            try {
              return await paypalStore.createOrder(props.totalPrice, props.paymentMethod);
            } catch (err) {
              console.error('Failed to create PayPal order:', err);
              throw err;
            }
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const response = await paypalStore.captureOrder(data.orderID, props.internalOrderId);
              alert('Transaction completed!');
              // Clear the cart
              await cartStore.clearCart();
              // Redirect to order confirmation page
              await router.push({name: 'OrderConfirmation'});
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

    onMounted(async () => {
      await paypalStore.fetchPayPalClientId();
      await loadPayPalScript(paypalStore.paypalClientId);
    });

    return {};
  },
});
</script>