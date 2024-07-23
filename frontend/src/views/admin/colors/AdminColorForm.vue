<template>
  <div>
    <Heading tag="h1">{{ headingText }}</Heading>
    <ColorForm />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import ColorForm from "@/components/modules/admin/colors/ColorForm.vue";
import {useRoute} from "vue-router";
import Heading from "@/components/Typography/Heading.vue";

export default defineComponent({
  name: 'AdminColorForm',
  components: {
    Heading,
    ColorForm,
  },
  setup() {
    const route = useRoute();
    const colorId = ref<number | null>(null);
    const isEdit = ref(false);

    onMounted(() => {
      if (route.params.id) {
        colorId.value = Number(route.params.id);
        isEdit.value = true;
      }
    });

    const headingText = computed(() => {
      return isEdit.value ? 'Modifier la couleur' : 'Créer une couleur';
    });

    return {
      colorId,
      isEdit,
      headingText,
    };
  },
});
</script>