<template>
  <div>
    <span>{{ item.label }}</span>
    <v-range-slider
        :model-value="[rangeValues.min, rangeValues.max]"
        :step="1"
        :min="rangeValues.min"
        :max="rangeValues.max"
        @update:model-value="updateRangeValues"
        class="align-center"
        hide-details
    >
      <template v-slot:prepend>
        <v-text-field
            v-model="rangeValues.min"
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
            v-model="rangeValues.max"
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
import {defineComponent, ref} from 'vue';
import {z} from "zod";
import {ProductFacetSchema} from "@/types/schemas/products.ts";


export default defineComponent({
  name: 'RangeFacets',
  props: {
    item: {
      type: Object as () => z.infer<typeof ProductFacetSchema>,
      required: true,
    },
  },
  setup(props) {
    const rangeValues = ref({
      min: props.item.values.min,
      max: props.item.values.max
    });

    const updateRangeValues = (value: [number, number]) => {
      rangeValues.value.min = value[0];
      rangeValues.value.max = value[1];
    };

    return {
      rangeValues,
      updateRangeValues
    };
  },
});
</script>
