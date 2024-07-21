<template>
  <div v-for="(item, id) in facets">
    <div v-if="item.type === 'range'">
      <RangeFacets :item="item"/>
    </div>
    <div v-else-if="item.type === 'checkbox'">
      <CheckboxFacets :item="item"/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
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
});
</script>
