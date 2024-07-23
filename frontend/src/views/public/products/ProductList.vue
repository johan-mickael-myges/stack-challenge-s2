<template>
  <v-row>
    <v-col cols="12" md="3" class="overflow-auto border-r" :style="[
      {height: contentHeight},
      {maxHeight: contentHeight},
    ]">
      <ProductFacets @update-values="handleFacetValuesUpdate" />
    </v-col>
    <v-col cols="12" md="9">
      <div class="gap-4">
        <div v-if="isLoading" class="text-center">
          <v-progress-circular
              color="black"
              indeterminate
          ></v-progress-circular>
        </div>
        <div v-else>
          <v-alert
              v-if="!products.length"
              text="Aucun produit ne correspond à votre recherche."
              density="compact"
              variant="tonal"
              color="grey"
          />
          <div v-else class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-7">
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
              <div class="flex flex-row justify-between items-center ml-1 mr-1">
                <div>
                  <v-card-text class="pa-0 mt-3">
                    <span class=" ">{{ product.name }}</span>
                  </v-card-text>
                  <v-card-subtitle class="pa-0">
                    <span>{{ product.price }} €</span>
                  </v-card-subtitle>
                </div>
                <div>
                  <v-btn color="white" variant="flat" block @click.stop="addProductToCart(product.originalId)">
                    <v-icon>mdi mdi-cart-plus</v-icon>
                  </v-btn>
                </div>
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
    </v-col>
  </v-row>
</template>

<script lang="ts">

import {useCartStore} from "@/stores/cart.ts";
import {useProductStore} from '@/stores/products';
import {defineComponent, computed, onMounted, ref, watch, onBeforeUnmount} from 'vue';
import notFoundImage from '@/assets/not-found-image.png';
import ProductFacets from "@/views/public/products/ProductFacets.vue";
import { usePageStore } from "@/stores/page";
import {useProductFacetsStore} from "@/stores/productFacets.ts";
import {useFacetQuery} from "@/composables/useFacetQuery.ts";
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'ProductList',
  components: {ProductFacets},
  data() {
    return {
      loading: true,
      notFoundImage,
    }
  },
  setup() {
    const store = useProductStore();
    const cartStore = useCartStore();
    const pageStore = usePageStore();
    const productFacetsStore = useProductFacetsStore();

    const itemsPerPage = ref(store.itemsPerPage);
    const currentPage = ref(store.currentPage);

    onMounted(() => {
      store.fetchAndCountProducts();
      pageStore.calculateNavbarHeight();

      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
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

    const contentHeight = computed(() => {
      return pageStore.contentHeightWithPx;
    });

    const handleResize = () => {
      pageStore.calculateNavbarHeight();
    };

    const handleFacetValuesUpdate = debounce(async (values: Record<string, string[]>) => {
      productFacetsStore.setSelectedFacets(values);
      const facetQuery = useFacetQuery(values);
      await store.fetchAndCountProducts({}, facetQuery);
    }, 300);

    return {
      isLoading,
      products,
      hoveredCard,
      totalPages,
      currentPage,
      handleMouseOver,
      handleMouseLeave,
      addProductToCart,
      contentHeight,
      handleFacetValuesUpdate,
    };
  },
});
</script>