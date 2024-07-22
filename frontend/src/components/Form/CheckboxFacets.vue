<template>
  <div>
    <span class="font-bold text-xl text-gray-900">{{ item.label }}</span>
    <v-checkbox
        v-for="(option, index) in item.values"
        :key="index"
        :value="option._id"
        v-model="selectedValues"
        density="compact"
        @change="emitSelectedValues"
        hide-details
    >
      <template v-slot:label>
        <span :class="{ 'text-black': isSelected(option._id), 'text-gray-700': !isSelected(option._id) }">{{ formatLabel(option) }}</span>
      </template>
    </v-checkbox>
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

    const isSelected = (value: string) => {
      return selectedValues.value.includes(value);
    };

    return {
      props,
      selectedValues,
      formatLabel,
      emitSelectedValues,
      isSelected,
    };
  },
});
</script>
