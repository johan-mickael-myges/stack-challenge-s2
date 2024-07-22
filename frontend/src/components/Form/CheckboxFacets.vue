<template>
  <div>
    <span>{{ item.label }}</span>
    <v-checkbox
        v-for="(option, index) in item.values"
        :key="index"
        :value="option._id"
        v-model="selectedValues"
        :label="formatLabel(option)"
        density="compact"
        @change="emitSelectedValues"
        hide-details
    ></v-checkbox>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
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
  emits: ['update-values'],
  setup(props, {emit}) {
    const selectedValues = ref<string[]>([]);

    const formatLabel = (itemValues: z.infer<typeof FacetValueCheckboxSchema>) => {
      return `${itemValues._id} (${itemValues.count})`;
    };

    const emitSelectedValues = () => {
      emit('update-values', selectedValues.value);
    };

    return {
      props,
      selectedValues,
      formatLabel,
      emitSelectedValues,
    };
  },
});
</script>
