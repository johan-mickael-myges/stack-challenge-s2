<template>
  <Facets :facets="facets" @update-values="handleUpdatedValues" />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import {useProductFacetsStore} from "@/stores/productFacets.ts";
import Facets from "@/components/modules/admin/products/Facets/Facets.vue";
import debounce from 'lodash/debounce';


export default defineComponent({
  name: 'ProductFacets',
  components: {Facets},
  emits: ['update-values'],
  setup(props, {emit}) {
    const store = useProductFacetsStore();
    const terms = ref<string>('');

    onMounted(() => {
      store.fetchProductFacets();
    });

    const facets = computed(() => store.facets);

    const handleUpdatedValues = (values: any) => {
      emit('update-values', values);
      terms.value = values['terms'];
    };

    watch(terms, debounce((newTerms: string) => {
      store.fetchProductFacets({
        terms: newTerms,
      });
    }, 300));

    return {
      facets,
      handleUpdatedValues,
    }
  }
});
</script>
