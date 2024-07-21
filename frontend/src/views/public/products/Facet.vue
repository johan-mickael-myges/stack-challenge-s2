<template>
  <div>
    <div v-for="(item, id) in facets">

    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useProductFacetsStore} from "@/stores/productFacets.ts";


export default defineComponent({
  name: 'Facet',
  setup() {
    const store = useProductFacetsStore();

    const facets = computed(() => store.facets);

    return {
      facets,
    }
  }
});
</script>
