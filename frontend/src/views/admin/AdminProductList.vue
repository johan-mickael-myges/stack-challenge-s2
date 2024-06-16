<template>
  <div>
    <ProductTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductTable from '@/components/admin/products/ProductTable.vue';

export default defineComponent({
  name: 'AdminProductList',
  components: {
    ProductTable,
  },
});
</script>
