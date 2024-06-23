<template>
  <DataTable
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      loading-text="Loading... Please wait"
      multi-sort
      @update:options="loadItems"
  >
    <template v-slot:top.title>
      <Heading tag="h3">List of products</Heading>
    </template>
    <template v-slot:top.actions>
      <v-btn color="secondary" @click="exportCSVHandler">Export CSV</v-btn>
      <v-btn color="primary" variant="flat" @click="$router.push('/admin/products/new')">Add New Product</v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="flex justify-end">
        <v-btn variant="text" density="compact" icon="mdi-pencil"
               @click="$router.push(`/admin/products/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete"
                      :deleteFunction="() => deleteProduct(item.id)"/>
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts">
import {defineComponent, computed, onMounted} from 'vue';
import {useProductStore} from "@/stores/products.ts";
import DeleteButton from '@/components/Button/DeleteButton.vue';
import {useCSVExport} from "@/composables/useCSVExport.ts";
import Heading from "@/components/Typography/Heading.vue";
import DataTable from "@/components/Table/DataTable.vue";
import {Header} from "@/components/Table/types/Header.ts";

export default defineComponent({
  name: 'ProductTable',
  components: {
    DataTable,
    Heading,
    DeleteButton,
  },
  setup() {
    const store = useProductStore();
    const {exportCSV} = useCSVExport();

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

    const loadItems = async (options: { page: number; itemsPerPage: number; sortBy: any }) => {
      await store.setPage(options.page);
      await store.setItemsPerPage(options.itemsPerPage);
      await store.setSortBy(options.sortBy);
    };

    return {
      loading,
      items,
      loadItems,
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
      ] as Header[],
    };
  },
  methods: {
    async exportCSVHandler() {
      await this.exportCSV(this.items, this.headers, ['actions'], 'products');
    }
  },
});
</script>
