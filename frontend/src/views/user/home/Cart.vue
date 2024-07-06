<template>
  <div class="cart-page">
    <h1 class="text-lg mb-4 font-semibold">Your Cart</h1>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular color="black" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <div v-if="cartItems.length === 0">
        <p>Your cart is empty.</p>
      </div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <v-card>
            <v-img :src="item.Product.images.length ? item.Product.images[0] : notFoundImage" class="cart-item-image"></v-img>
            <v-card-title>{{ item.Product.name }}</v-card-title>
            <v-card-subtitle>{{ item.Product.price }} €</v-card-subtitle>
            <v-card-text>
              Quantity: {{ item.quantity }}
              <v-btn icon @click="removeFromCart(item.Product.id)">
                <v-icon size="20px">mdi-delete</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </div>
        <div class="total-price">
          <p>Total Price: {{ totalPrice }} €</p>
        </div>
        <div id="paypal-button-container"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import notFoundImage from '@/assets/not-found-image.png';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  id: number;
  quantity: number;
  Product: Product;
}

export default defineComponent({
  name: 'Cart',
  data() {
    return {
      isLoading: true,
      notFoundImage,
      cartItems: [] as CartItem[],
      paypalLoaded: false
    };
  },
  setup() {
    const cartItems = ref<CartItem[]>([]);
    const isLoading = ref(true);
    const paypalLoaded = ref(false);
    const userId = 1; // Dummy user ID for now

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/cart/${userId}`);
        cartItems.value = response.data.CartItems;
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const removeFromCart = async (productId: number) => {
      try {
        await axios.delete(`http://localhost:8000/cart/${userId}/${productId}`);
        cartItems.value = cartItems.value.filter(item => item.Product.id !== productId);
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
      }
    };

    const totalPrice = computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + item.Product.price * item.quantity;
      }, 0);
    });

    const loadPayPalScript = async () => {
      try {
        const response = await axios.get('http://localhost:8000/config/paypal-client-id');
        if (response.status !== 200 || !response.data.clientId) {
          throw new Error('Failed to fetch PayPal client ID');
        }
        const PAYPAL_CLIENT_ID = response.data.clientId;
        console.log("PayPal Client ID:", PAYPAL_CLIENT_ID);

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
        script.onload = () => {
          console.log("PayPal script loaded");
          paypalLoaded.value = true;
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
      if (!paypalLoaded.value) return;

      // @ts-ignore
      paypal.Buttons({
        createOrder: async (): Promise<string> => {
          try {
            const response = await axios.post('http://localhost:8000/payment/create-order', { userId, totalPrice: totalPrice.value });
            console.log('Order created:', response.data);
            return response.data.orderID;
          } catch (error) {
            console.error('Failed to create order:', error);
            throw error;
          }
        },
        onApprove: async (data: { orderID: string }): Promise<void> => {
          try {
            const response = await axios.post('http://localhost:8000/payment/capture-order', { orderID: data.orderID });
            console.log('Order captured:', response.data);
            alert('Transaction completed!');
            fetchCartItems(); // Reload cart after successful transaction
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
      fetchCartItems();
      loadPayPalScript();
    });

    return {
      cartItems,
      isLoading,
      totalPrice,
      removeFromCart
    };
  }
});
</script>

<style scoped>
.cart-page {
  padding: 20px;
}
.cart-item {
  margin-bottom: 20px;
}
.cart-item-image {
  width: 100px;
  height: 100px;
}
.total-price {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}
</style>
