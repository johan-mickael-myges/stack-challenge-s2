<template>
  <SearchTerm @update-values="updateFacetValues('terms', $event)" />
  <div v-for="(item) in facets" class="py-2 border-b-1">
    <div v-if="item.type === 'range' && item.values">
      <RangeFacets :item="item" @update-values="updateFacetValues(item.id, $event)" />
    </div>
    <div v-else-if="item.type === 'checkbox' && item.values.length > 0">
      <CheckboxFacets :item="item" @update-values="updateFacetValues(item.id, $event)" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import RangeFacets from "@/components/Form/RangeFacets.vue";
import CheckboxFacets from "@/components/Form/CheckboxFacets.vue";
import {z} from "zod";
import {ProductFacetsSchema} from "@/types/schemas/products.ts";
import SearchTerm from "@/components/Form/SearchTerm.vue";


export default defineComponent({
  name: 'Facets',
  components: {SearchTerm, CheckboxFacets, RangeFacets},
  props: {
    facets: {
      type: Array as () => z.infer<typeof ProductFacetsSchema>,
      required: true,
    },
  },
  emits: ['update-values'],
  setup(props, {emit}) {
    const selectedValues = ref<string[]>([]);

    const updateFacetValues = (index: string, values: any) => {
      selectedValues.value[index] = values;
      emit('update-values', selectedValues.value);
    };

    return {
      updateFacetValues,
    };
  },

});
</script>
