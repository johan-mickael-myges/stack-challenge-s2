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
      <div class="flex">
        <v-btn variant="text" density="compact"  icon="mdi-pencil" @click="$router.push(`/admin/products/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete" :deleteFunction="() => deleteProduct(item.id)" />
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useProductStore } from "@/stores/admin/products.ts";
import DeleteButton from '@/components/Button/DeleteButton.vue';

export default defineComponent({
  name: 'ProductTable',
  components: {
    DeleteButton,
  },
  setup() {
    const store = useProductStore();

    onMounted(() => {
      store.fetchProducts();
    });

    const products = computed(() => store.products);

    const deleteProduct = async (id: number|undefined) => {
      if (!id) return;
      try {
        await store.deleteProduct(id);
      } catch (error) {
        throw new Error('An error occurred while trying to delete the item.');
      }
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
