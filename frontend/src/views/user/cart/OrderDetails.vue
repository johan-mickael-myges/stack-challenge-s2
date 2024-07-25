<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <div v-if="error" class="error">
            <p>Erreur lors de la récupération des détails de la commande.</p>
          </div>
          <div v-else>
            <h2 class="text-2xl font-bold mb-4">Vos commandes</h2>
            <div v-if="cartItems.length === 0">
              <p>Votre panier est vide</p>
            </div>
            <div v-else>
              <ProductToPay :items="cartItems"/>
            </div>
            <OrderTotalRecap
              :total-products-price="totalProductsPrice"
              :total-shipping-cost="totalShippingCost"
              :total-to-pay="totalToPay"
            />
            <PaypalButton :total-price="totalToPay" :internal-order-id="order.id + ''" />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import useOrderDetails from '@/composables/useOrderDetails';
import PaypalButton from "@/components/Button/PaypalButton.vue";
import OrderTotalRecap from '@/components/modules/admin/products/OrderTotalRecap.vue';
import ProductToPay from '@/components/modules/admin/products/ProductToPay.vue';
import { useCartStore } from "@/stores/cart.ts";

export default defineComponent({
  name: 'OrderDetails',
  components: { PaypalButton, OrderTotalRecap, ProductToPay },
  setup() {
    const route = useRoute();
    const orderId = route.params.orderId as string;
    const totalShippingCost = Number(route.query.totalShippingCost);

    const { order, loading, error, fetchOrderDetails } = useOrderDetails(orderId);

    const cartStore = useCartStore();
    const cartItems = computed(() => cartStore.getItemsWithAllDetails);

    const totalProductsPrice = computed(() => cartStore.cartTotal.toFixed(2));
    const formattedTotalShippingCost = totalShippingCost.toFixed(2);
    const totalToPay = computed(() => (parseFloat(totalProductsPrice.value) + parseFloat(formattedTotalShippingCost)).toFixed(2));

    onMounted(async () => {
      await cartStore.fetchCart();
      await fetchOrderDetails();
    });

    return {
      order,
      loading,
      error,
      cartItems,
      totalProductsPrice,
      totalShippingCost: formattedTotalShippingCost,
      totalToPay
    };
  },
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
