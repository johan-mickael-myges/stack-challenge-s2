<template>
  <div class="p-5 gap-4">
    <h1 class="text-4xl mb-4">Bijoux</h1>
    <div v-if="false">Loading...</div>
    <div v-else>
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">

        <div v-for="product in products" :key="product.id">

          <v-card variant="elevated" 
                  @mouseover="handleMouseOver(product.id)" 
                  @mouseleave="handleMouseLeave()"
                  @click="$router.push(`/product/${product.id}`)">
            <v-img v-if="product.images" :src="product.images.length != 0 ? product.images[0] : notFoundImage ">

              <template v-if="hoveredCard === product.id">
                <v-card-actions class="absolute bottom-0 left-0 w-full z-10 text-center bg-black bg-opacity-70 transition-opacity duration-700">
                  <v-btn color="white" block prepend-icon="mdi-cart-plus">
                    <v-icon color="white"></v-icon>
                    <span> Ajouter au panier</span>
                  </v-btn>
                </v-card-actions>
              </template>
            
            </v-img>
          </v-card>
          <div class="flex flex-row  justify-between ml-1 mr-1">
            <div>
              <v-card-text class="pa-0 mt-3" >
                <span class=" ">{{ product.name }}</span>
              </v-card-text>
              <v-card-subtitle class="pa-0">
                <span >{{ product.price }} €</span>
              </v-card-subtitle>
            </div>
            <v-icon size="25px" class="mt-4">mdi-heart-outline</v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useProductStore } from '@/stores/products';
import { defineComponent, computed, onMounted, ref } from 'vue';
import notFoundImage from '@/assets/not-found-image.png'

export default defineComponent({
    name: 'ProductList',
    data() {
      return {
        notFoundImage,
      }
    },
  setup() {
    const store = useProductStore();

    onMounted(() => {
      store.fetchProducts({itemsPerPage: 100});
    });

    const products = computed(() => store.products);
    const hoveredCard = ref<number | null>(null);

    const handleMouseOver = (productId: number | undefined) => {
    if (productId !== undefined) {
        hoveredCard.value = productId;
    }
};

    const handleMouseLeave = () => {
    hoveredCard.value = null;
    };

    return {products, hoveredCard, handleMouseOver, handleMouseLeave};
  },
});

</script>
