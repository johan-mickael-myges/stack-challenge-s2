<template>
  <div>
    <Heading tag="h1">List of products</Heading>
    <ProductTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductTable from '@/components/admin/products/ProductTable.vue';
import Heading from '@/components/Typography/Heading.vue';

export default defineComponent({
  name: 'AdminProductList',
  components: {
    ProductTable,
    Heading,
  },
});
</script>
