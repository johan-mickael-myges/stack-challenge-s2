<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field v-model="formState.data.name" label="Name" required></v-text-field>
    <v-btn type="submit" color="primary" :disabled="formState.isSubmitting">Save</v-btn>
    <v-btn color="gray" variant="text" @click="cancelRequest" v-if="formState.isSubmitting">Cancel</v-btn>
    <v-progress-linear v-if="formState.isSubmitting" indeterminate color="primary"></v-progress-linear>
    <v-alert v-if="formState.httpError" type="error">{{ formState.httpError }}</v-alert>
    <v-alert v-for="(errors, field) in formState.validationErrors" :key="field" type="error">{{ field }}: {{ errors.join(', ') }}</v-alert>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from '@/composables/useForm';
import { z } from 'zod';
import {useCategoryStore} from "@/stores/admin/categories.ts";

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
      id: undefined,
      name: '',
    };

    const { formState, submitForm, cancelRequest } = useForm(initialData, categorySchema);

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
          formState.data = store.category;
        });
      }
    });

    return { formState, handleSubmit, cancelRequest };
  },
});
</script>