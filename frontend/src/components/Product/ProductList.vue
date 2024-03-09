<script setup lang="ts">
import {useProductStore} from "../../stores/product.ts";
import {onMounted} from "vue";

const productStore = useProductStore();

const {
  fetch,
  data: products,
  loading
} = productStore;

onMounted(async () => {
  await fetch();
});

</script>

<template>
  <div class="p-5 gap-4">
    <h1 class="text-5xl mb-4">PRODUCTS</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="product in products.value" :key="product.id">
          <v-card variant="elevated">
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-text>
              {{ product.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                  color="success"
                  variant="elevated"
                  prepend-icon="mdi-cart-plus"
              >
                <template v-slot:prepend>
                  <v-icon color="white"></v-icon>
                </template>
                Ajouter au panier
              </v-btn>
              <v-btn
                  color="primary"
                  variant="elevated"
              >
                Acheter
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>