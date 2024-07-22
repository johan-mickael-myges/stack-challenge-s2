<template>
  <Facets :facets="facets" @update-values="handleUpdatedValues" />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
import {useProductFacetsStore} from "@/stores/productFacets.ts";
import Facets from "@/components/modules/admin/products/Facets/Facets.vue";


export default defineComponent({
  name: 'ProductFacets',
  components: {Facets},
  emits: ['update-values'],
  setup(props, {emit}) {
    const store = useProductFacetsStore();

    onMounted(() => {
      store.fetchProductFacets();
    });

    const facets = computed(() => store.facets);

    const handleUpdatedValues = (values: any) => {
      emit('update-values', values);
    };

    return {
      facets,
      handleUpdatedValues,
    }
  }
});
</script>
