<template>
  <div>
    <CategoryTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Heading from '@/components/Typography/Heading.vue';
import CategoryTable from "@/components/modules/admin/categories/CategoryTable.vue";

export default defineComponent({
  name: 'AdminProductList',
  components: {
    CategoryTable,
    Heading,
  },
});
</script>
