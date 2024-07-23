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
      <Heading tag="h3">Liste des matériaux</Heading>
    </template>
    <template v-slot:top.actions>
      <v-btn color="secondary" @click="exportCSVHandler">Exporter CSV</v-btn>
      <v-btn color="primary" variant="flat" @click="$router.push('/admin/materials/new')">Ajouter un nouveau matériel</v-btn>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="flex justify-end">
        <v-btn variant="text" density="compact"  icon="mdi-pencil" @click="$router.push(`/admin/materials/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete" :deleteFunction="() => deleteMaterial(item.id)" />
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import DeleteButton from '@/components/Button/DeleteButton.vue';
import {useMaterialStore} from "@/stores/materials.ts";
import Heading from "@/components/Typography/Heading.vue";
import {useCSVExport} from "@/composables/useCSVExport.ts";
import DataTable from "@/components/Table/DataTable.vue";

export default defineComponent({
  name: 'MaterialTable',
  components: {
    DataTable,
    Heading,
    DeleteButton,
  },
  setup() {
    const store = useMaterialStore();
    const { exportCSV } = useCSVExport();

    onMounted(async () => {
      await store.fetchMaterials();
      await store.countMaterials();
    });

    const items = computed(() => store.materials);
    const totalItems = computed(() => store.total);
    const loading = computed(() => store.loading);

    const deleteMaterial = async (id: number|undefined) => {
      if (!id) return;
      try {
        await store.deleteMaterial(id);
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
      deleteMaterial,
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
      await this.exportCSV(this.items, this.headers, ['actions'], 'materials');
    }
  },
});
</script>
