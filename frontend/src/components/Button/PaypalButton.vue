<template>
  <div class="w-full p-5 bg-gray-100">
    <div id="paypal-button-container" class="w-full"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, PropType } from 'vue';
import { usePayPalStore } from '@/stores/paypal';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import {useShippingMethodStore} from "@/stores/shippingMethods.ts";

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
    const shippingMethodsStore = useShippingMethodStore();
    const router = useRouter();

    onMounted(async () => {
      await paypalStore.fetchPayPalClientId();
      await shippingMethodsStore.fetchShippingMethods();
      if (paypalStore.paypalClientId) {
        await loadPayPalScript(paypalStore.paypalClientId);
      } else {
        console.error('Failed to load PayPal client ID');
      }
    });

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
          createOrder: async () => {
            try {
              const orderId = await paypalStore.createOrder(props.totalPrice);
              return orderId;
            } catch (err) {
              console.error('Failed to create PayPal order:', err);
              throw err;
            }
          },
          onApprove: async (data: any) => {
            try {
              await paypalStore.captureOrder(data.orderID, props.internalOrderId);
              await cartStore.clearCart();
              await router.push({ name: 'OrderConfirmation' });
            } catch (err) {
              console.error('Failed to capture PayPal order:', err);
            }
          },
          onError: (err: any) => {
            console.error('PayPal Button error:', err);
          },
        }).render('#paypal-button-container');
      }
    };

    return {};
  },
});
</script>