<template>
  <DataTable
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      loading-text="Chargement... Veuillez patienter"
      multi-sort
      @update:options="loadItems"
  >
    <template v-slot:top.title>
      <Heading tag="h3">Liste des produits</Heading>
    </template>
    <template v-slot:top.actions>
      <v-btn color="secondary" @click="exportCSVHandler">Exporter CSV</v-btn>
      <v-btn color="primary" variant="flat" @click="$router.push('/admin/products/new')">Ajouter un nouveau produit</v-btn>
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
import {useAuthStore} from "@/stores/auth.ts";

export default defineComponent({
  name: 'ProductTable',
  components: {
    DataTable,
    Heading,
    DeleteButton,
  },
  setup() {
    const authStore = useAuthStore();
    const productStore = useProductStore();
    const {exportCSV} = useCSVExport();

    onMounted(async () => {
      await productStore.fetchProducts();
      await productStore.countProducts();
    });

    const items = computed(() => productStore.products);
    const totalItems = computed(() => productStore.total);
    const loading = computed(() => productStore.loading);

    const deleteProduct = async (id: number | undefined) => {
      if (!id) return;
      try {
        await productStore.deleteProduct(id);
      } catch (error) {
        throw new Error('Une erreur s\'est produite lors de la tentative de suppression de l\'élément.');
      }
    };

    const loadItems = async (options: { page: number; itemsPerPage: number; sortBy: any }) => {
      await productStore.setPage(options.page);
      await productStore.setItemsPerPage(options.itemsPerPage);
      await productStore.setSortBy(options.sortBy);
    };

    return {
      loading,
      items,
      loadItems,
      totalItems,
      deleteProduct,
      store: productStore,
      exportCSV,
    };
  },
  data() {
    return {
      headers: [
        {title: 'Nom', value: 'name', sortable: true},
        {title: 'Référence', value: 'reference', sortable: true},
        {title: 'Prix', value: 'price', sortable: true},
        {title: '', value: 'actions', sortable: false},
      ] as Header[],
    };
  },
  methods: {
    async exportCSVHandler() {
      await this.exportCSV(this.items, this.headers, ['actions'], 'produits');
    }
  },
});
</script>
