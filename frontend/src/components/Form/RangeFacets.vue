<template>
    <span>{{ item.id }}</span>
    <v-range-slider
        v-model="item.values"
        :max="10"
        :min="-10"
        :step="1"
        class="align-center"
        hide-details
    >
      <template v-slot:prepend>
        <v-text-field
            v-model="item.values['min']"
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
            v-model="item.values['max']"
            density="compact"
            style="width: 70px"
            type="number"
            variant="outlined"
            hide-details
            single-line
        ></v-text-field>
      </template>
    </v-range-slider>
</template>

<script lang="ts">
import {defineComponent} from 'vue';


export default defineComponent({
  name: 'RangeFacets',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>
