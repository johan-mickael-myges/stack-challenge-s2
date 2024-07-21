<template>
  <Facets :facets="facets" />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
import {useProductFacetsStore} from "@/stores/productFacets.ts";
import Facets from "@/components/modules/admin/products/Facets/Facets.vue";


export default defineComponent({
  name: 'ProductFacets',
  components: {Facets},
  setup() {
    const store = useProductFacetsStore();

    onMounted(() => {
      store.fetchProductFacets();
    });

    const facets = computed(() => store.facets);

    return {
      facets,
    }
  }
});
</script>
