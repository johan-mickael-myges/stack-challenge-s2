<template>
  <div v-for="(item) in facets">
    <div v-if="item.type === 'range'">
      <RangeFacets :item="item" @update-values="updateFacetValues(item.id, $event)" />
    </div>
    <div v-else-if="item.type === 'checkbox'">
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


export default defineComponent({
  name: 'Facets',
  components: {CheckboxFacets, RangeFacets},
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
