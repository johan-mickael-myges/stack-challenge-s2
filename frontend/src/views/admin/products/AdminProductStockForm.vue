<template>
  <v-form @submit.prevent="handleSubmit" lazy-validation>
    <input type="hidden" :value="formState.data.id.value">
    <v-number-input
        v-model="formState.data.quantity.value"
        label="Quantité"
        required
        :rules="rules.quantity"
        :error-messages="formState.validationErrors?.quantity?.join(' | ')"
    >
    </v-number-input>
    <v-select
        v-model="formState.data.type.value"
        :items="typeData"
        item-title="label"
        item-value="value"
        label="Type"
        required
        :rules="rules.type"
        :error-messages="formState.validationErrors?.type?.join(' | ')"
    />
    <v-btn type="submit" color="primary" :disabled="formState.isSubmitting">Enregistrer</v-btn>
    <v-btn color="gray" variant="text" @click="cancelRequest" v-if="formState.isSubmitting">Annuler</v-btn>
    <v-progress-linear v-if="formState.isSubmitting" indeterminate color="primary"></v-progress-linear>
    <v-alert v-if="formState.httpError" type="error" dismissible>{{ formState.httpError }}</v-alert>
  </v-form>
</template>

<script lang="ts">

import {z} from "zod";

const stockSchema = z.object({
  id: z.number(),
  quantity: z.number().int().min(0),
  type: z.string()
});

import {computed, defineComponent, onMounted, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {useForm} from "@/composables/useForm.ts";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import {useProductStore} from "@/stores/products.ts";

export default defineComponent({
  name: 'AdminProductStockForm',
  components: {
    VNumberInput
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useProductStore();

    const productId = Number(route.params.id);

    if (!productId) {
      router.push('/admin/products');
    }

    const typeData = [
      {
        label: 'Entrée',
        value: 'in',
      },
      {
        label: 'Sortie',
        value: 'out',
      }
    ];

    const initialData = {
      id: {
        value: productId,
      },
      quantity: {
        value: 1,
        rules: [
          (v: number) => v >= 0 || 'La quantité doit être positive',
        ],
      },
      type: {
        value: 'in',
        rules: [
          (v: string) => ['in', 'out'].includes(v) || 'Le type est invalide',
        ],
      },
    };

    const { formState, submitForm, cancelRequest, rules } = useForm(initialData, stockSchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        await store.addStock(data, signal);
        router.push('/admin/products');
      });
    };

    return {
      formState,
      handleSubmit,
      cancelRequest,
      rules: rules(),
      productId,
      typeData
    };
  },
});
</script>