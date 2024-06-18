<script lang="ts">
import { useProductStore } from "@/stores/user/products";
import { useCartStore } from "@/stores/user/cartItem";
import { defineComponent, computed, onMounted, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "ProductList",
  setup() {
    const store = useProductStore();

    const {
      addToCart
    } = useCartStore();

    onMounted(() => {
      store.fetchProducts();
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
    return {
      products,
      hoveredCard,
      handleMouseOver,
      handleMouseLeave,
      addToCart,
    };
  },
});
</script>

<template>
  <div class="p-5 gap-4">
    <h1 class="text-4xl mb-4">Bijoux</h1>
    <div v-if="false">Loading...</div>
    <div v-else>
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="product in products" :key="product.id">
          <v-card
            variant="elevated"
            @mouseover="handleMouseOver(product.id)"
            @mouseleave="handleMouseLeave()"
          >
            <v-img :src="product.images ? product.images[0] : ''">
              <v-icon size="20px" class="icon-overlay"
                >mdi-heart-outline</v-icon
              >

              <v-card-text
                class="product_infos"
                :class="{ 'shifted-up': hoveredCard === product.id }"
              >
                {{ product.name }}
              </v-card-text>
              <v-card-subtitle
                class="product_infos"
                :class="{ 'shifted-up': hoveredCard === product.id }"
              >
                <span>{{ product.price }} €</span>
              </v-card-subtitle>

              <template v-if="hoveredCard === product.id">
                <v-card-actions class="card-actions">
                  <v-btn
                    color="white"
                    class="add-to-cart-btn"
                    block
                    prepend-icon="mdi-cart-plus"
                    @click="addToCart(product.id)"
                  >
                    <v-icon color="white"></v-icon>
                    <span> Ajouter au panier</span>
                  </v-btn>
                </v-card-actions>
              </template>
            </v-img>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
}

.product_infos {
  position: absolute;
  bottom: 0;
  left: 0;
  margin-bottom: 15px;
}

.shifted-up {
  transform: translateY(-40px);
  transition: transform 0.1s ease;
}

.card-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.7s ease;
}

.add-to-cart-btn {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
