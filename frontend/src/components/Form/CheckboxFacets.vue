<template>
  <div>
    <span class="font-bold text-xl text-gray-900">{{ item.label }}</span>
    <v-checkbox
        v-for="(option, index) in item.values[0].items"
        :key="index"
        :value="option.other ? option.items : option._id"
        v-model="selectedValues"
        density="compact"
        @update:modelValue="emitSelectedValues"
        hide-details
    >
      <template v-slot:label>
        <span :class="{ 'text-black': isSelected(option._id), 'text-gray-700': !isSelected(option._id) }">{{ formatLabel(option) }}</span>
      </template>
    </v-checkbox>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { z } from "zod";
import { FacetValueCheckboxSchema, ProductFacetSchema } from "@/types/schemas/products";
import { useProductFacetsStore } from "@/stores/productFacets";

export default defineComponent({
  name: 'CheckboxFacets',
  props: {
    item: {
      type: Object as () => z.infer<typeof ProductFacetSchema>,
      required: true,
    },
  },
  emits: ['update-values'],
  setup(props, { emit }) {
    const productFacetsStore = useProductFacetsStore();
    const selectedFacets = computed(() => productFacetsStore.selectedFacets);
    const selectedValues = ref<string[]>([]);

    onMounted(() => {
      if (selectedFacets.value[props.item.id]) {
        selectedValues.value = [...selectedFacets.value[props.item.id]];
      }
    });

    watch(selectedFacets, (newSelectedFacets) => {
      if (newSelectedFacets[props.item.id]) {
        selectedValues.value = [...newSelectedFacets[props.item.id]];
      }
    }, { immediate: true });

    watch(selectedValues, () => {
      emitSelectedValues();
    });

    const formatLabel = (itemValues: z.infer<typeof FacetValueCheckboxSchema>) => {
      return itemValues.other ? `Autre (${itemValues.count})` : `${itemValues._id} (${itemValues.count})`;
    };

    const emitSelectedValues = () => {
      const flattenedValues = selectedValues.value.flatMap(value => {
        if (Array.isArray(value)) {
          return value.map(v => v._id);
        } else if (typeof value === 'object' && value._id) {
          return value._id;
        }
        return value;
      });
      emit('update-values', flattenedValues);
    };

    const isSelected = (value: string) => selectedValues.value.includes(value);

    return {
      selectedValues,
      formatLabel,
      emitSelectedValues,
      isSelected,
    };
  },
});
</script>
