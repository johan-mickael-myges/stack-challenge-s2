<template>
  <div v-if="product" class="flex flex-col gap-8 p-8 border border-gray-300 rounded-lg md:flex-row">
    <v-img class="flex-1 max-w-full object-cover rounded-lg md:max-w-1/2" v-if="product.images" :src="product.images[0]"></v-img>
    <div class="flex flex-1 max-w-full flex-col justify-center items-center md:max-w-1/2">
      <div class="flex flex-col">
        <div class="flex justify-between">
          <span class="text-xs text-gray-600">{{ product.reference }}</span>
          <v-icon size="20px" class="absolute top-0 right-0">mdi-heart-outline</v-icon>
        </div>
        <span class="text-xl mt-2">{{ product.name }}</span>
        <span class="text-xs text-gray-600">Cartier</span>
        <span class="text-[0.855rem] mt-[0.2rem]">{{ product.price }} €</span>
        <p class="text-sm my-2">{{ product.description }}</p>
        <button class="bg-black text-white py-4 px-6 rounded-full text-sm font-medium cursor-pointer my-4">Place in Cart</button>
        <p class="text-xs text-gray-600 text-center mt-4">Complimentary Carbon Efficient Delivery or Collect-in-Store.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/products';
import Heading from "@/components/Typography/Heading.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: 'UserProduct',
  components: {
    Heading,
  },
  setup() {
    const route = useRoute();
    const store = useProductStore();
    const productId = ref<number | null>(null);

    onMounted(() => {
      if (route.params.id) {
        store.fetchProduct(Number(route.params.id));
        productId.value = Number(route.params.id);
      }
    });
    const product = computed(() => store.product);

    return {
      productId,
      product
    };
  },
});
</script>
