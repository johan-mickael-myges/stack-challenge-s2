<template>
  <div>
    <Heading tag="h1">{{ headingText }}</Heading>
    <BrandForm />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import BrandForm from "@/components/modules/admin/brands/BrandForm.vue";
import {useRoute} from "vue-router";
import Heading from "@/components/Typography/Heading.vue";

export default defineComponent({
  name: 'AdminBrandForm',
  components: {
    Heading,
    BrandForm,
  },
  setup() {
    const route = useRoute();
    const brandId = ref<number | null>(null);
    const isEdit = ref(false);

    onMounted(() => {
      if (route.params.id) {
        brandId.value = Number(route.params.id);
        isEdit.value = true;
      }
    });

    const headingText = computed(() => {
      return isEdit.value ? 'Modifier la marque' : 'Créer une marque';
    });

    return {
      brandId,
      isEdit,
      headingText,
    };
  },
});
</script>