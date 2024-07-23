<template>
  <v-form @submit.prevent="handleSubmit" lazy-validation>
    <v-text-field
        v-model="formState.data.name.value"
        label="Nom"
        required
        :error-messages="formState.validationErrors?.name?.join(' | ')"
    >
    </v-text-field>
    <v-btn type="submit" color="primary" :disabled="formState.isSubmitting">Enregistrer</v-btn>
    <v-btn color="gray" variant="text" @click="cancelRequest" v-if="formState.isSubmitting">Annuler</v-btn>
    <v-progress-linear v-if="formState.isSubmitting" indeterminate color="primary"></v-progress-linear>
    <v-alert v-if="formState.httpError" type="error" dismissible>{{ formState.httpError }}</v-alert>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from '@/composables/useForm.ts';
import { z } from 'zod';
import { useMaterialStore } from '@/stores/materials.ts';

const materialSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export default defineComponent({
  name: 'MaterialForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useMaterialStore();

    const initialData = {
      id: {
        value: undefined,
      },
      name: {
        value: '',
      },
    };

    const { formState, submitForm, cancelRequest, initData } = useForm(initialData, materialSchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        if (data.id) {
          await store.updateMaterial(data, signal);
        } else {
          await store.createMaterial(data, signal);
        }
        router.push('/admin/materials');
      });
    };

    onMounted(() => {
      if (route.params.id) {
        store.fetchMaterial(Number(route.params.id)).then(() => {
          initData(store.material, initialData);
        });
      }
    });

    return { formState, handleSubmit, cancelRequest };
  },
});
</script>
