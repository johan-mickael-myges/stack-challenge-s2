<template>
  <v-data-table :headers="headers" :items="categories" class="border" hide-default-footer>
    <template v-slot:top>
      <v-toolbar flat>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$router.push('/admin/categories/new')">Add New Category</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="flex">
        <v-btn variant="text" density="compact"  icon="mdi-pencil" @click="$router.push(`/admin/categories/edit/${item.id}`)"></v-btn>
        <DeleteButton variant="text" density="compact" icon="mdi-delete" :deleteFunction="() => deleteCategory(item.id)" />
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import DeleteButton from '@/components/Button/DeleteButton.vue';
import {useCategoryStore} from "@/stores/admin/categories.ts";

export default defineComponent({
  name: 'CategoryTable',
  components: {
    DeleteButton,
  },
  setup() {
    const store = useCategoryStore();

    onMounted(() => {
      store.fetchCategories();
    });

    const categories = computed(() => store.categories);

    const deleteCategory = async (id: number|undefined) => {
      if (!id) return;
      try {
        await store.deleteCategory(id);
      } catch (error) {
        throw new Error('An error occurred while trying to delete the item.');
      }
    };

    return { categories, deleteCategory };
  },
  data() {
    return {
      headers: [
        { title: 'Name', value: 'name' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
});
</script>
