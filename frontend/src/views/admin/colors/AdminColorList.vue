<template>
  <div>
    <ColorTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Heading from '@/components/Typography/Heading.vue';
import ColorTable from "@/components/modules/admin/colors/ColorTable.vue";

export default defineComponent({
  name: 'AdminColorList',
  components: {
    ColorTable,
    Heading,
  },
});
</script>
