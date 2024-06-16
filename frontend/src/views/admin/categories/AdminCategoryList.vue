<template>
  <div>
    <Heading tag="h1">List of categories</Heading>
    <CategoryTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Heading from '@/components/Typography/Heading.vue';
import CategoryTable from "@/components/admin/categories/CategoryTable.vue";

export default defineComponent({
  name: 'AdminProductList',
  components: {
    CategoryTable,
    Heading,
  },
});
</script>
