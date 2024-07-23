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
import { useColorStore } from '@/stores/colors.ts';

const colorSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

export default defineComponent({
  name: 'ColorForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useColorStore();

    const initialData = {
      id: {
        value: undefined,
      },
      name: {
        value: '',
      },
    };

    const { formState, submitForm, cancelRequest, initData } = useForm(initialData, colorSchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        if (data.id) {
          await store.updateColor(data, signal);
        } else {
          await store.createColor(data, signal);
        }
        router.push('/admin/colors');
      });
    };

    onMounted(() => {
      if (route.params.id) {
        store.fetchColor(Number(route.params.id)).then(() => {
          initData(store.color, initialData);
        });
      }
    });

    return { formState, handleSubmit, cancelRequest };
  },
});
</script>
