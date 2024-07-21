<template>
  <span>{{ item.id }}</span>
  <v-checkbox
      v-for="(option, index) in item.values"
      :key="index"
      v-model="option._id"
      :label="option._id"
      density="compact"
  ></v-checkbox>
</template>

<script lang="ts">
import {defineComponent} from 'vue';


export default defineComponent({
  name: 'CheckboxFacets',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>
