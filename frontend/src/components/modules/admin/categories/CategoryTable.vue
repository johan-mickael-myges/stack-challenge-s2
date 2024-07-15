<template>
  <DataTable
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      loading-text="Chargement... Veuillez patienter"
      @update:options="loadItems"
  >
    <template v-slot:top.title>
      <Heading tag="h3">Liste des catégories</Heading>
    </template>
    <template v-slot:top.actions>
      <v-btn color="secondary" @click="exportCSVHandler">Exporter CSV</v-btn>
      <v-btn color="primary" variant="flat" @click="$router.push('/admin/categories/new')">Ajouter une nouvelle catégorie</v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="flex justify-end">
        <v-btn variant="text" density="compact"  icon="mdi-pencil" @click="$router.push(`/admin/categories/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete" :deleteFunction="() => deleteCategory(item.id)" />
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import DeleteButton from '@/components/Button/DeleteButton.vue';
import {useCategoryStore} from "@/stores/categories.ts";
import Heading from "@/components/Typography/Heading.vue";
import {useCSVExport} from "@/composables/useCSVExport.ts";
import DataTable from "@/components/Table/DataTable.vue";

export default defineComponent({
  name: 'CategoryTable',
  components: {
    DataTable,
    Heading,
    DeleteButton,
  },
  setup() {
    const store = useCategoryStore();
    const { exportCSV } = useCSVExport();

    onMounted(async () => {
      await store.fetchCategories();
    });

    const items = computed(() => store.categories);
    const totalItems = computed(() => store.total);
    const loading = computed(() => store.loading);

    const deleteCategory = async (id: number|undefined) => {
      if (!id) return;
      try {
        await store.deleteCategory(id);
      } catch (error) {
        throw new Error('Une erreur s\'est produite lors de la tentative de suppression de l\'élément.');
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
      deleteCategory,
      store,
      exportCSV,
    };
  },
  data() {
    return {
      headers: [
        { title: 'Nom', value: 'name', sortable: true },
        { title: 'Créé le', value: 'createdAt', sortable: true },
        { title: '', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    async exportCSVHandler() {
      await this.exportCSV(this.items, this.headers, ['actions'], 'categories');
    }
  },
});
</script>
