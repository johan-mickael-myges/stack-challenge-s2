<template>
  <div>
    <span class="font-bold text-xl text-gray-900">{{ item.label }}</span>
    <v-range-slider
        v-model="rangeValues"
        :max="item.values.max"
        :min="item.values.min"
        :step="1"
        class="align-center"
        hide-details
        @update:modelValue="emitSelectedValues"
        @change="emitSelectedValues"
    >
      <template v-slot:prepend>
        <v-text-field
            v-model="rangeValues[0]"
            density="compact"
            style="width: 70px"
            type="number"
            variant="outlined"
            hide-details
            single-line
        ></v-text-field>
      </template>
      <template v-slot:append>
        <v-text-field
            v-model="rangeValues[1]"
            density="compact"
            style="width: 70px"
            type="number"
            variant="outlined"
            hide-details
            single-line
        ></v-text-field>
      </template>
    </v-range-slider>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch, computed, onMounted} from 'vue';
import { z } from "zod";
import { ProductFacetSchema } from "@/types/schemas/products";
import { useProductFacetsStore } from "@/stores/productFacets";

export default defineComponent({
  name: 'RangeFacets',
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
    const rangeValues = ref([props.item.values.min, props.item.values.max]);

    onMounted(() => {
      if (selectedFacets.value[props.item.id]) {
        rangeValues.value = [...selectedFacets.value[props.item.id]];
      }
    });

    watch(selectedFacets, (newSelectedFacets) => {
      if (newSelectedFacets[props.item.id]) {
        rangeValues.value = [...newSelectedFacets[props.item.id]];
      }
    }, { immediate: true });

    watch(rangeValues, () => {
      emitSelectedValues();
    });

    const emitSelectedValues = () => {
      emit('update-values', rangeValues.value);
    };

    return {
      rangeValues,
      emitSelectedValues,
    };
  },
});
</script>