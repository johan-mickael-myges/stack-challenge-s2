<template>
  <div v-if="product" class="flex flex-col gap-8 p-8 rounded-lg md:flex-row">
    
    <div v-if="product.images && product.images.length" class="relative flex-1 max-w-full items-center justify-center content-center md:max-w-1/2">
      <v-img
        v-if="isMdOrLarger"
        :key="image"
        v-for="image in product.images"
        :src="image"
        class="w-full object-cover rounded-lg"
      ></v-img>
      <v-img
        class="w-full h-full object-cover rounded-lg"
         v-else-if="!isMdOrLarger"
        :src="product.images[currentImageIndex]"
      ></v-img>

      <div v-if="!isMdOrLarger" class="flex justify-center">
        <v-btn v-if="product.images && product.images.length > 1" icon elevation="1" class="mr-1">
          <v-icon
            class=""
            @click="prevImage"
          >
            mdi-chevron-left
          </v-icon>
        </v-btn> 
        
        <v-btn v-if="product.images && product.images.length > 1" icon elevation="1" >
          <v-icon @click="nextImage">
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else class="relative flex-1 max-w-full items-center justify-center content-center md:max-w-1/2">
      <v-img
        class="w-full h-full object-cover rounded-lg"
        :src="notFoundImage"
      ></v-img>
    </div>

    <div class="flex flex-1 max-w-full flex-col md:items-center md:max-w-1/2">
      <div class="flex flex-col md:fixed md:w-[35vw] md:mt-[2vh] lg:w-[25vw] lg:mt-[15vh]">
        <div class="flex justify-between">
          <span class="text-xs text-gray-600 ">{{ product.reference }}</span>
          <v-icon size="20px" class="absolute top-0 right-0">mdi-heart-outline</v-icon>
        </div>
        <span class="text-xl mt-2">{{ product.name }}</span>
        <span v-if="brand" class="text-xs text-gray-600">{{ brand }}</span>
        <span class="text-[0.855rem] mt-[0.2rem]">{{ product.price }} €</span>
        <p class="text-sm my-2">{{ product.description }}</p>
        <button class="bg-black text-white py-4 px-6 rounded-full text-sm font-medium cursor-pointer my-4" @click="addToCart">Place in Cart</button>        <p class="text-xs text-gray-600 text-center mt-4">Complimentary Carbon Efficient Delivery or Collect-in-Store.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onUnmounted, defineComponent, onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/products';
import { useBrandStore } from '@/stores/brands';
import Heading from "@/components/Typography/Heading.vue";
import { useRoute } from "vue-router";
import notFoundImage from '@/assets/not-found-image.png';
import axios from 'axios';

export default defineComponent({
  name: 'UserProduct',
  components: {
    Heading,
  },
  setup() {
    const route = useRoute();
    const store = useProductStore();
    const brandStore = useBrandStore()
    const isMdOrLarger = ref(window.innerWidth >= 768)
    const currentImageIndex = ref(0);

    onMounted(() => {
      if (route.params.id) {
        store.fetchProduct(Number(route.params.id));
        
        if(store.product?.brandId){
          brandStore.fetchBrand(store.product.brandId);
        }
      }
      window.addEventListener('resize', updateWindowSize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateWindowSize);
    });

    const product = computed(() => store.product);
    const brand = computed(() => brandStore.brand?.name);
    
    const updateWindowSize = () => {
      isMdOrLarger.value = window.innerWidth >= 768;
    };

    const nextImage = () => {
      if (product.value && product.value.images) {
        currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length;
      }
    };

    const prevImage = () => {
      if (product.value && product.value.images) {
        currentImageIndex.value =
          (currentImageIndex.value - 1 + product.value.images.length) % product.value.images.length;
      }
    };
    const addToCart = async () => {
      try {
        const userId = 1; // Dummy user ID for now provisoire
        const quantity = 1; 
        await axios.post(`http://localhost:8000/cart/add`, { productId: product.value.id, userId, quantity });
        alert('Le produit a été ajouté au panier.');
      } catch (error) {
        console.error('Failed to add product to cart:', error);
        alert('Échec de l\'ajout du produit au panier');
      }
    };
    return {
      product,
      brand,
      currentImageIndex,
      nextImage,
      prevImage,
      isMdOrLarger,
      addToCart
    };
  },
  data() {
      return {
        notFoundImage,
      }
    },
});
</script>
