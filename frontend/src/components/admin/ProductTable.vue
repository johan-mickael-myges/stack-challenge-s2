<template>
  <v-data-table :headers="headers" :items="products" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Products</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$router.push('/admin/products/new')">Add New Product</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="$router.push(`/admin/products/edit/${item.id}`)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteProduct(item.id)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useProductStore } from "@/stores/admin/products.ts";

export default defineComponent({
  name: 'ProductTable',
  setup() {
    const store = useProductStore();

    onMounted(() => {
      store.fetchProducts();
    });

    const products = computed(() => store.products);

    const deleteProduct = (id: number) => {
      store.deleteProduct(id);
    };

    return { products, deleteProduct };
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Reference', value: 'reference' },
        { text: 'Price', value: 'price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
});
</script>
