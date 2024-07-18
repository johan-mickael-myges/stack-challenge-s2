<template>
  <v-form @submit.prevent="handleSubmit" lazy-validation>
    <v-text-field
        v-model="formState.data.name.value"
        label="Nom"
        required
        :rules="rules.name"
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
import { useCategoryStore } from '@/stores/categories.ts';

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export default defineComponent({
  name: 'CategoryForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useCategoryStore();

    const initialData = {
      id: {
        value: undefined,
      },
      name: {
        value: '',
        rules: [
          (v: string) => !!v || 'Le nom est requis',
          (v: string) => v.length >= 3 || 'Le nom doit comporter au moins 3 caractères',
          (v: string) => v.length <= 255 || 'Le nom doit comporter au plus 255 caractères',
        ],
      },
    };

    const { formState, submitForm, cancelRequest, rules, initData } = useForm(initialData, categorySchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        if (data.id) {
          await store.updateCategory(data, signal);
        } else {
          await store.createCategory(data, signal);
        }
        router.push('/admin/categories');
      });
    };

    onMounted(() => {
      if (route.params.id) {
        store.fetchCategory(Number(route.params.id)).then(() => {
          initData(store.category, rules());
        });
      }
    });

    return { formState, handleSubmit, cancelRequest, rules: rules() };
  },
});
</script>
