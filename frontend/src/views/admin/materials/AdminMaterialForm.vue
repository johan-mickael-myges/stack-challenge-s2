<template>
  <div>
    <Heading tag="h1">{{ headingText }}</Heading>
    <MaterialForm />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import MaterialForm from '@/components/modules/admin/materials/MaterialForm.vue';
import {useRoute} from "vue-router";
import Heading from "@/components/Typography/Heading.vue";

export default defineComponent({
  name: 'AdminMaterialForm',
  components: {
    Heading,
    MaterialForm,
  },
  setup() {
    const route = useRoute();
    const materialId = ref<number | null>(null);
    const isEdit = ref(false);

    onMounted(() => {
      if (route.params.id) {
        materialId.value = Number(route.params.id);
        isEdit.value = true;
      }
    });

    const headingText = computed(() => {
      return isEdit.value ? 'Modifier le matériau' : 'Créer un matériau';
    });

    return {
      materialId,
      isEdit,
      headingText,
    };
  },
});
</script>