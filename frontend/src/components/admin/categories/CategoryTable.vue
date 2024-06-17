<template>
  <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      @update:options="loadItems"
      class="shadow"
  >
    <template v-slot:top>
      <v-toolbar flat class="px-4">
        <Heading tag="h3">List of categories</Heading>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="exportCSVHandler">Export CSV</v-btn>
        <v-btn color="primary" variant="flat" @click="$router.push('/admin/categories/new')">Add New Category</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="flex justify-end">
        <v-btn variant="text" density="compact"  icon="mdi-pencil" @click="$router.push(`/admin/categories/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete" :deleteFunction="() => deleteCategory(item.id)" />
      </div>
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import DeleteButton from '@/components/Button/DeleteButton.vue';
import {useCategoryStore} from "@/stores/admin/categories.ts";
import Heading from "@/components/Typography/Heading.vue";
import {useCSVExport} from "@/composables/useCSVExport.ts";

export default defineComponent({
  name: 'CategoryTable',
  components: {
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
        throw new Error('An error occurred while trying to delete the item.');
      }
    };

    return {
      loading,
      items,
      totalItems,
      deleteCategory,
      store,
      exportCSV,
    };
  },
  data() {
    return {
      headers: [
        { title: 'Name', value: 'name', sortable: true },
        { title: 'Created At', value: 'createdAt', sortable: true },
        { title: '', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    async loadItems({ page, itemsPerPage, sortBy }) {
      await this.store.fetchCategories({ page, itemsPerPage, sortBy});
    },

    async exportCSVHandler() {
      await this.exportCSV(this.items, this.headers, ['actions'], 'categories');
    }
  },
});
</script>
