<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field v-model="formState.data.name" label="Name" required></v-text-field>
    <v-text-field v-model="formState.data.reference" label="Reference" required></v-text-field>
    <v-textarea v-model="formState.data.description" label="Description"></v-textarea>
    <v-text-field v-model.number="formState.data.price" label="Price" required></v-text-field>
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
import { useForm } from '@/composables/useForm.ts';
import { z } from 'zod';
import { useProductStore } from '@/stores/products.ts';

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  reference: z.string(),
  description: z.string().optional(),
  price: z.number(),
  images: z.array(z.string()).optional(),
});

export default defineComponent({
  name: 'ProductForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useProductStore();

    const initialData = {
      id: undefined,
      brandId: null,
      name: '',
      reference: '',
      description: '',
      price: 0,
      images: [],
    };

    const { formState, submitForm, cancelRequest } = useForm(initialData, productSchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        if (data.id) {
          await store.updateProduct(data, signal);
        } else {
          await store.createProduct(data, signal);
        }
        router.push('/admin/products');
      });
    };

    onMounted(() => {
      if (route.params.id) {
        store.fetchProduct(Number(route.params.id)).then(() => {
          formState.data = store.product;
        });
      }
    });

    return { formState, handleSubmit, cancelRequest };
  },
});
</script>