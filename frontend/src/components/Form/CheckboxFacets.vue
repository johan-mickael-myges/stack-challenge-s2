<template>
  <div>
    <span class="font-bold text-xl text-gray-900">{{ item.label }}</span>
    <v-checkbox
        v-for="(option, index) in item.values[0].items"
        :key="index"
        :value="option.other ? option.items : option._id"
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
import {computed, defineComponent, ref, watch} from 'vue';
import {z} from "zod";
import {FacetValueCheckboxSchema, ProductFacetSchema} from "@/types/schemas/products.ts";
import {useProductFacetsStore} from "@/stores/productFacets.ts";

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
    const productFacetsStore = useProductFacetsStore();
    const selectedFacets = computed(() => productFacetsStore.selectedFacets);

    const selectedValues = ref<string[]>([]);

    watch(selectedFacets, (newSelectedFacets) => {
      if (newSelectedFacets[props.item.id]) {
        selectedValues.value = [...newSelectedFacets[props.item.id]];
      }
    }, { immediate: true });

    const formatLabel = (itemValues: z.infer<typeof FacetValueCheckboxSchema>) => {
      if (itemValues.other === true) {
        return `Autre (${itemValues.count})`;
      }

      return `${itemValues._id} (${itemValues.count})`;
    };

    const emitSelectedValues = () => {
      const flattenedValues: string[] = selectedValues.value.flatMap((value: any) => {
        if (Array.isArray(value)) {
          return value.map((v: { _id: string }) => v._id);
        } else if (typeof value === 'object' && value._id) {
          return value._id;
        }
        return value;
      });

      emit('update-values', flattenedValues);
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
