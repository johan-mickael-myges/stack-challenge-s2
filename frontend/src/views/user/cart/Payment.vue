<template>
    <v-container class="payment-page py-4">
    <v-row>
        <v-col cols="12">
        <h1 class="text-lg mb-4 font-semibold">Paiement</h1>
        </v-col>
        <v-col cols="12">
        <v-card class="p-4">
            <div id="paypal-button-container"></div>
        </v-card>
        </v-col>
    </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default defineComponent({
    name: 'Payment',
    setup() {
    const route = useRoute();
    const orderId = route.params.orderId;

    const loadPayPalScript = async () => {
        if (document.getElementById('paypal-sdk')) {
        setupPayPalButton();
        return;
        }

        try {
        const response = await axios.get('http://localhost:8000/config/paypal-client-id');
        if (response.status !== 200 || !response.data.clientId) {
            throw new Error('Failed to fetch PayPal client ID');
        }
        const PAYPAL_CLIENT_ID = response.data.clientId;
        // console.log("PayPal Client ID:", PAYPAL_CLIENT_ID);

        const script = document.createElement('script');
        script.id = 'paypal-sdk';
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
        script.onload = () => {
            console.log("PayPal script loaded");
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

    const setupPayPalButton = () => {
        // @ts-ignore
        paypal.Buttons({
        createOrder: async (): Promise<string> => {
            try {
            const response = await axios.post('http://localhost:8000/payment/create-order', { orderId });
            // console.log('Order created:', response.data);
            return response.data.orderID;
            } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
            }
        },
        onApprove: async (data: { orderID: string }): Promise<void> => {
            try {
            const response = await axios.post('http://localhost:8000/payment/capture-order', { orderID: data.orderID });
            // console.log('Order captured:', response.data);
            alert('Transaction completed!');
            } catch (error) {
            console.error('Failed to capture order:', error);
            alert('Failed to complete transaction.');
            }
        },
        onError: (err: any): void => {
            console.error('PayPal Button error:', err);
            alert('An error occurred during the transaction.');
        }
        }).render('#paypal-button-container');
        console.log("PayPal button setup");
    };

    onMounted(() => {
        loadPayPalScript();
    });

    return {};
    },
});
</script>

<style scoped>
.payment-page {
    padding: 20px;
}
</style>
  