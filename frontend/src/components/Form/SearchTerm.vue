<template>
  <div>
    <v-text-field
        v-model="searchTerm"
        @input="emitSelectedValues"
        dense
        placeholder="Rechercher"
        @change="emitSelectedValues"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch, onMounted, computed} from 'vue';
import { useProductFacetsStore } from "@/stores/productFacets";

export default defineComponent({
  name: 'SearchTerm',
  emits: ['update-values'],
  setup(props, { emit }) {
    const productFacetsStore = useProductFacetsStore();
    const selectedFacets = computed(() => productFacetsStore.selectedFacets);
    const searchTerm = ref<string>('');

    onMounted(() => {
      searchTerm.value = <string>selectedFacets.value['terms'] || '';
    });

    watch(searchTerm, () => {
      emitSelectedValues();
    });

    const emitSelectedValues = () => {
      emit('update-values', searchTerm.value);
    };

    return {
      searchTerm,
      emitSelectedValues,
    };
  },
});
</script>