<template>
  <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      multi-sort
      @update:options="loadItems"
      class="shadow"
  >
    <template v-slot:top>
      <v-toolbar flat class="px-4">
        <Heading tag="h3">List of products</Heading>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="exportCSVHandler">Export CSV</v-btn>
        <v-btn color="primary" variant="flat" @click="$router.push('/admin/products/new')">Add New Product</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="flex justify-end">
        <v-btn variant="text" density="compact" icon="mdi-pencil"
               @click="$router.push(`/admin/products/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete"
                      :deleteFunction="() => deleteProduct(item.id)"/>
      </div>
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
import {defineComponent, computed, onMounted} from 'vue';
import {useProductStore} from "@/stores/admin/products.ts";
import DeleteButton from '@/components/Button/DeleteButton.vue';
import {useCSVExport} from "@/composables/useCSVExport.ts";
import Heading from "@/components/Typography/Heading.vue";

export default defineComponent({
  name: 'ProductTable',
  components: {
    Heading,
    DeleteButton,
  },
  setup() {
    const store = useProductStore();
    const { exportCSV } = useCSVExport();

    onMounted(async () => {
      await store.fetchProducts();
    });

    const items = computed(() => store.products);
    const totalItems = computed(() => store.total);
    const loading = computed(() => store.loading);

    const deleteProduct = async (id: number | undefined) => {
      if (!id) return;
      try {
        await store.deleteProduct(id);
      } catch (error) {
        throw new Error('An error occurred while trying to delete the item.');
      }
    };

    return {
      loading,
      items,
      totalItems,
      deleteProduct,
      store,
      exportCSV,
    };
  },
  data() {
    return {
      headers: [
        {title: 'Name', value: 'name', sortable: true},
        {title: 'Reference', value: 'reference', sortable: true},
        {title: 'Price', value: 'price', sortable: true},
        {title: '', value: 'actions', sortable: false},
      ],
    };
  },
  methods: {
    async loadItems({ page, itemsPerPage, sortBy }) {
      await this.store.fetchProducts({ page, itemsPerPage, sortBy});
    },

    async exportCSVHandler() {
      await this.exportCSV(this.items, this.headers, ['actions'], 'products');
    }
  },
});
</script>
