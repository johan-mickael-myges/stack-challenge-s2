<template>
  <v-chip
      v-for="(value, index) in item"
      :key="index"
      :text="value"
      size="small"
      class="mx-1"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Filename',
  props: {
    item: {
      type: [Array],
      required: true,
    },
  },
});
</script>
