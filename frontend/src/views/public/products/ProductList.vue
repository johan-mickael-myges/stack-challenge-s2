<template>
  <div class="gap-4">
    <h1 class="text-lg mb-4 font-semibold">Bijoux</h1>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular
          color="black"
          indeterminate
      ></v-progress-circular>
    </div>
    <div v-else>
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-7">

        <div v-for="product in products" :key="product.originalId">

          <v-card variant="elevated"
                  @mouseover="handleMouseOver(product.originalId)"
                  @mouseleave="handleMouseLeave()"
                  @click="$router.push(`/products/${product.originalId}`)">

            <v-progress-linear
                v-if="loading"
                indeterminate
                color="black"
                height="3"
                class="absolute top-0 left-0 w-full z-10">
            </v-progress-linear>

            <v-img v-if="product.images"
                   @load="loading = false"
                   @error="loading = false"
                   @progress="loading = true"
                   :src="product.thumbnail ? product.thumbnail : notFoundImage"
            >

              <template v-if="hoveredCard === product.originalId">
                <v-card-actions
                    class="absolute bottom-0 left-0 w-full z-10 text-center bg-black bg-opacity-70 transition-opacity duration-700">
                  <v-btn color="white" block prepend-icon="mdi-cart-plus" @click.stop="addProductToCart(product.originalId)">
                    <v-icon color="white"></v-icon>
                    <span> Ajouter au panier</span>
                  </v-btn>
                </v-card-actions>
              </template>

            </v-img>
          </v-card>
          <div class="flex flex-row  justify-between ml-1 mr-1">
            <div>
              <v-card-text class="pa-0 mt-3">
                <span class=" ">{{ product.name }}</span>
              </v-card-text>
              <v-card-subtitle class="pa-0">
                <span>{{ product.price }} €</span>
              </v-card-subtitle>
            </div>
            <v-icon size="25px" class="mt-4">mdi-heart-outline</v-icon>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-10">
        <v-pagination
            class="w-full max-w-xl"
            v-model="currentPage"
            :length="totalPages"
            rounded="circle"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {useCartStore} from "@/stores/cart.ts";
import {useProductStore} from '@/stores/products';
import {defineComponent, computed, onMounted, ref, watch} from 'vue';
import notFoundImage from '@/assets/not-found-image.png';

export default defineComponent({
  name: 'ProductList',
  data() {
    return {
      loading: true,
      notFoundImage,
    }
  },
  setup() {
    const store = useProductStore();
    const cartStore = useCartStore();

    const itemsPerPage = ref(store.itemsPerPage);
    const currentPage = ref(store.currentPage);

    onMounted(() => {
      store.fetchAndCountProducts();
    });

    const isLoading = computed(() => store.loading);
    const products = computed(() => store.products);
    const totalPages = computed(() => store.totalPage);

    const hoveredCard = ref<number | null>(null);

    watch(currentPage, (newPage) => {
      store.setPage(newPage);
    });

    watch(itemsPerPage, (newItemsPerPage) => {
      store.setItemsPerPage(newItemsPerPage);
    });

    const handleMouseOver = (productId: number | undefined) => {
      if (productId !== undefined) {
        hoveredCard.value = productId;
      }
    };

    const handleMouseLeave = () => {
      hoveredCard.value = null;
    };

    const addProductToCart = async (productId: number) => {
      await cartStore.addToCart(productId, 1);
    };

    return {
      isLoading,
      products,
      hoveredCard,
      totalPages,
      currentPage,
      handleMouseOver,
      handleMouseLeave,
      addProductToCart,
    };
  },
});
</script>
