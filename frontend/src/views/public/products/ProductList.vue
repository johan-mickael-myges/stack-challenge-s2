<template>
  <v-row>
    <v-col cols="12" md="3" class="overflow-auto border-r" :style="[{ height: contentHeight }, { maxHeight: contentHeight }]">
      <ProductFacets @update-values="handleFacetValuesUpdate" />
    </v-col>
    <v-col cols="12" md="9">
      <div class="gap-4">
        <div v-if="isLoading" class="text-center">
          <v-progress-circular color="black" indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <v-alert v-if="!products.length" text="Nous n'avons pas trouvé de résultat correspondant à votre recherche." variant="tonal" color="grey" />
          <div v-else class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mt-7">
            <div v-for="product in products" :key="product.originalId">
              <v-card variant="elevated" @mouseover="handleMouseOver(product.originalId)" @mouseleave="handleMouseLeave()" @click="$router.push(`/products/${product.originalId}`)">
                <v-progress-linear v-if="loading" indeterminate color="black" height="3" class="absolute top-0 left-0 w-full z-10"></v-progress-linear>
                <v-img v-if="product.images" @load="loading = false" @error="loading = false" @progress="loading = true" :src="product.thumbnail ? product.thumbnail : notFoundImage">
                  <template v-if="hoveredCard === product.originalId">
                    <v-card-actions class="absolute bottom-0 left-0 w-full z-10 text-center bg-black bg-opacity-70 transition-opacity duration-700">
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
                    <span class="">{{ product.name }}</span>
                  </v-card-text>
                  <v-card-subtitle class="pa-0">
                    <span>{{ product.price }} €</span>
                  </v-card-subtitle>
                </div>
                <div class="flex flex-row items-center justify-end">
                  <v-tooltip v-if="product.stocks > 0" class="grid-cols-1">
                    <template v-slot:activator="{ props }">
                      <v-icon  v-bind="props" class="grid-cols-1" color="green">mdi-check-circle</v-icon>
                    </template>
                    <template v-slot:default>
                      {{ product.stocks }} éléments disponible en stock.
                    </template>
                  </v-tooltip>
                  <v-tooltip v-else class="grid-cols-1">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="grid-cols-1" color="red">mdi-minus-circle</v-icon>
                    </template>
                    <template v-slot:default>
                      Actuellement indisponible
                    </template>
                  </v-tooltip>
                  <v-tooltip class="grid-cols-1" text="Ajouter au panier">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" color="white" variant="flat" icon @click.stop="addProductToCart(product.originalId)">
                        <v-icon>mdi mdi-cart-plus</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-10">
            <v-pagination class="w-full max-w-xl" v-model="currentPage" :length="totalPages" rounded="circle" ></v-pagination>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/products';
import { usePageStore } from '@/stores/page';
import { useProductFacetsStore } from '@/stores/productFacets';
import { useFacetQuery } from '@/composables/useFacetQuery';

import ProductFacets from '@/views/public/products/ProductFacets.vue';
import notFoundImage from '@/assets/not-found-image.png';

export default defineComponent({
  name: 'ProductList',
  components: { ProductFacets },
  setup() {
    const store = useProductStore();
    const cartStore = useCartStore();
    const pageStore = usePageStore();
    const productFacetsStore = useProductFacetsStore();
    const router = useRouter();
    const route = useRoute();

    const loading = ref(true);
    const itemsPerPage = ref(store.itemsPerPage);
    const currentPage = ref(store.currentPage);
    const hoveredCard = ref<number | null>(null);

    const contentHeight = computed(() => pageStore.contentHeightWithPx);
    const isLoading = computed(() => store.loading);
    const products = computed(() => store.products);
    const totalPages = computed(() => store.totalPage);

    const handleResize = () => pageStore.calculateNavbarHeight();

    onMounted(async () => {
      pageStore.calculateNavbarHeight();
      await parseQueryParams(route.query);

      currentPage.value = parseInt(route.query.page as string, 10) || 1;
      itemsPerPage.value = parseInt(route.query.limit as string, 10) || store.itemsPerPage;

      const facetValues = computed(() => productFacetsStore.selectedFacets);
      const facetQuery = useFacetQuery(facetValues.value);

      await store.fetchProducts({
        page: currentPage.value,
      }, facetQuery);
      await store.countProducts({ limit: '', ...facetQuery });

      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => window.removeEventListener('resize', handleResize));

    watch(currentPage, async (newPage) => {
      await store.setPage(newPage);
      await updateProducts();
    });

    watch(itemsPerPage, async (newItemsPerPage) => {
      await store.setItemsPerPage(newItemsPerPage);
      await updateProducts();
    });

    const updateProducts = async () => {
      const facetValues = computed(() => productFacetsStore.selectedFacets);
      const facetQuery = useFacetQuery(facetValues.value);
      await router.push({ query: { page: currentPage.value, limit: itemsPerPage.value, ...facetQuery } });
      await store.fetchProducts({ page: currentPage.value }, facetQuery);
    };

    const handleMouseOver = (productId: number | undefined) => {
      if (productId !== undefined) hoveredCard.value = productId;
    };

    const handleMouseLeave = () => hoveredCard.value = null;

    const addProductToCart = async (productId: number) => await cartStore.addToCart(productId, 1);

    const handleFacetValuesUpdate = debounce(async (values: Record<string, string[]>) => {
      currentPage.value = 1;
      productFacetsStore.setSelectedFacets(values);

      const facetQuery = useFacetQuery(values);

      await router.replace({ query: { page: currentPage.value, limit: itemsPerPage.value, ...facetQuery } });
      await store.fetchProducts({}, facetQuery);
      await store.countProducts({ limit: '', ...facetQuery });
    }, 100);

    const parseQueryParams = async (query: Record<string, any>) => {
      const selectedFacets: Record<string, string[]> = {};
      Object.entries(query).forEach(([key, value]) => {
        const decodedValue = decodeURIComponent(value as string);
        const match = key.match(/^q\[(.+?)\]\[(\d+)\]$/);
        if (match) {
          const [_, facet, index] = match;
          if (!selectedFacets[facet]) selectedFacets[facet] = [];
          selectedFacets[facet][parseInt(index, 10)] = decodedValue;
        } else if (key.startsWith('q[') && key.endsWith(']')) {
          const facet = key.slice(2, -1);
          if (facet === 'terms') {
            selectedFacets[facet] = decodedValue;
          } else {
            selectedFacets[facet] = Array.isArray(decodedValue) ? decodedValue : [decodedValue];
          }
        }
      });
      productFacetsStore.setSelectedFacets(selectedFacets);
    };

    return {
      loading,
      notFoundImage,
      itemsPerPage,
      currentPage,
      hoveredCard,
      contentHeight,
      isLoading,
      products,
      totalPages,
      handleMouseOver,
      handleMouseLeave,
      addProductToCart,
      handleFacetValuesUpdate,
    };
  },
});
</script>
