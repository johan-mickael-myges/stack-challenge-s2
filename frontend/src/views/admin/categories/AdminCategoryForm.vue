<template>
  <div>
    <Heading tag="h1">{{ headingText }}</Heading>
    <CategoryForm />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import CategoryForm from "@/components/admin/categories/CategoryForm.vue";
import {useRoute} from "vue-router";
import Heading from "@/components/Typography/Heading.vue";

export default defineComponent({
  name: 'AdminProductForm',
  components: {
    Heading,
    CategoryForm,
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
      return isEdit.value ? 'Edit category' : 'Create category';
    });

    return {
      productId,
      isEdit,
      headingText,
    };
  },
});
</script>