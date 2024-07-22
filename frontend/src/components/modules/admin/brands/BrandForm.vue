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
import { useBrandStore } from '@/stores/brands.ts';

const brandSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export default defineComponent({
  name: 'BrandForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useBrandStore();

    const initialData = {
      id: {
        value: undefined,
      },
      name: {
        value: '',
      },
    };

    const { formState, submitForm, cancelRequest, initData } = useForm(initialData, brandSchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        if (data.id) {
          await store.updateBrand(data, signal);
        } else {
          await store.createBrand(data, signal);
        }
        router.push('/admin/brands');
      });
    };

    onMounted(() => {
      if (route.params.id) {
        store.fetchBrand(Number(route.params.id)).then(() => {
          initData(store.brand, initialData);
        });
      }
    });

    return { formState, handleSubmit, cancelRequest };
  },
});
</script>
