<template>
  <div>
    <div class="flex justify-between">
      <p>Total produits</p>
      <p>{{ totalProductsPrice }} €</p>
    </div>
    <div class="flex justify-between">
      <p>Frais de livraison</p>
      <p>{{ totalShippingCost }} €</p>
    </div>
    <div class="flex justify-between">
      <b>Total à payer</b>
      <b>{{ totalToPay }} €</b>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: 'OrderTotalRecap',
  props: {
    totalProductsPrice: {
      type: Number,
      required: true
    },
    totalShippingCost: {
      type: Number,
      required: true
    },
    totalToPay: {
      type: Number,
      required: true
    }
  },
});
</script>

