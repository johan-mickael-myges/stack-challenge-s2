<template>
  <div>
    <BrandTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Heading from '@/components/Typography/Heading.vue';
import BrandTable from '@/components/modules/admin/brands/BrandTable.vue';

export default defineComponent({
  name: 'AdminBrandList',
  components: {
    BrandTable,
    Heading,
  },
});
</script>
