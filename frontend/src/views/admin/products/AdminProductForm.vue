<template>
  <div>
    <Heading tag="h1">{{ headingText }}</Heading>
    <ProductForm />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import ProductForm from '@/components/admin/products/ProductForm.vue';
import Heading from "@/components/Typography/Heading.vue";
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'AdminProductForm',
  components: {
    Heading,
    ProductForm,
  },
  setup() {
    const route = useRoute();
    const productId = ref<number | null>(null);
    const isEdit = ref(false);

    onMounted(() => {
      if (route.params.id) {
        productId.value = Number(route.params.id);
        isEdit.value = true;
      }
    });

    const headingText = computed(() => {
      return isEdit.value ? 'Edit product' : 'Create product';
    });

    return {
      productId,
      isEdit,
      headingText,
    };
  },
});
</script>