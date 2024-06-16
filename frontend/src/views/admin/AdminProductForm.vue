<template>
  <div>
    <ProductForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductForm from '@/components/admin/ProductForm.vue';

export default defineComponent({
  name: 'AdminProductForm',
  components: {
    ProductForm,
  },
});
</script>