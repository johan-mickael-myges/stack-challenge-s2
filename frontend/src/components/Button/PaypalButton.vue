<template>
  <div class="w-full flex flex-row justify-center items-center">
    <div id="paypal-button-container" class="w-full bg-red-400"></div>
  </div>
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

    const createOrder = async (totalPrice: number, paymentMethod: string) => {
      try {
        return await paypalStore.createOrder(totalPrice, paymentMethod);
      } catch (err) {
        throw err;
      }
    };

    const captureOrder = async (orderID: string, internalOrderId: string) => {
      try {
        await paypalStore.captureOrder(orderID, internalOrderId);
        await cartStore.clearCart();
        await router.push({name: 'OrderConfirmation'});
      } catch (err) {
        console.error('Failed to capture PayPal order:', err);
      }
    };

    const onError = (err: any) => {
      console.error('PayPal Button error:', err);
    };

    const setupPayPalButton = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return createOrder(props.totalPrice, props.paymentMethod);
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              captureOrder(data.orderID, props.internalOrderId);
            });
          },
          onError: onError,
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

<style scoped>
.paypal-button-container {
  width: 100%;
}
</style>