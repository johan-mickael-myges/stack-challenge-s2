<template>
  <div v-for="item in items" :key="item.id" class="flex items-center justify-between mb-4 border-b">
    <div class="flex items-center">
      <img :src="item.Product.thumbnail" alt="product image" class="w-16 h-16 object-cover" />
      <div class="ml-4">
        <p class="text-lg font-bold">{{ item.Product.name }}</p>
        <p>{{ item.Product.price }} €</p>
      </div>
    </div>
    <b>x {{ item.quantity }}</b>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: 'ProductToPay',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
});
</script>