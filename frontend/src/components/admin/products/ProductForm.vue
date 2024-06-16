<template>
  <v-form @submit.prevent="saveProduct">
    <v-text-field v-model="product.name" label="Name" required></v-text-field>
    <v-text-field v-model="product.reference" label="Reference" required></v-text-field>
    <v-textarea v-model="product.description" label="Description"></v-textarea>
    <v-text-field v-model.number="product.price" label="Price" required></v-text-field>
    <v-btn type="submit" color="primary">Save</v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from "@/stores/admin/products.ts";
import { Product } from '@/stores/admin/products.ts';

export default defineComponent({
  name: 'ProductForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useProductStore();

    const product = ref<Product>({ name: '', reference: '', description: '', price: 0, images: [] });

    const saveProduct = async () => {
      if (product.value.id) {
        await store.updateProduct(product.value);
      } else {
        await store.createProduct(product.value);
      }
      router.push('/admin/products');
    };

    onMounted(() => {
      if (route.params.id) {
        store.fetchProduct(Number(route.params.id)).then(() => {
          product.value = store.product as Product;
        });
      }
    });

    return { product, saveProduct };
  },
});
</script>