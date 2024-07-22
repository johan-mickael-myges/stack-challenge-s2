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
import { defineComponent, ref } from 'vue';
import { z } from "zod";
import { ProductFacetSchema } from "@/types/schemas/products.ts";

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
    const rangeValues = ref([props.item.values.min, props.item.values.max]);

    const emitSelectedValues = () => {
      emit('update-values', rangeValues.value);
    };

    return {
      props,
      rangeValues,
      emitSelectedValues,
    };
  },
});
</script>
