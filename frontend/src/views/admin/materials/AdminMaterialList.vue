<template>
  <div>
    <MaterialTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Heading from '@/components/Typography/Heading.vue';
import MaterialTable from "@/components/modules/admin/materials/MaterialTable.vue";

export default defineComponent({
  name: 'AdminMaterialList',
  components: {
    MaterialTable,
    Heading,
  },
});
</script>
