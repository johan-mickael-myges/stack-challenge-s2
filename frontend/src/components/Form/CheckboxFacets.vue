<template>
  <span>{{ item.label }}</span>
  <v-checkbox
      v-for="(option, index) in item.values"
      :key="index"
      v-model="option._id"
      :label="formatLabel(option)"
      density="compact"
  ></v-checkbox>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {z} from "zod";
import {FacetValueCheckboxSchema, ProductFacetSchema} from "@/types/schemas/products.ts";


export default defineComponent({
  name: 'CheckboxFacets',
  props: {
    item: {
      type: Object as () => z.infer<typeof ProductFacetSchema>,
      required: true,
    },
  },
  setup(props) {
    const formatLabel = (itemValues: z.infer<typeof FacetValueCheckboxSchema>) => {
      return `${itemValues._id} (${itemValues.count})`;
    };

    return {
      props,
      formatLabel,
    }
  },
});
</script>
