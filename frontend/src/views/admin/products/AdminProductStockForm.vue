<template>
  <v-form @submit.prevent="handleSubmit" lazy-validation>
    <input type="hidden" name="productId" :value="productId">
    <v-number-input
        v-model="formState.data.quantity.value"
        label="Quantité"
        required
        :rules="rules.name"
        :error-messages="formState.validationErrors?.name?.join(' | ')"
    >
    </v-number-input>
    <v-select v-model="formState.data.type.value" :items="typeData" item-title="label" item-value="value" label="Type" required />
    <v-btn type="submit" color="primary" :disabled="formState.isSubmitting">Enregistrer</v-btn>
    <v-btn color="gray" variant="text" @click="cancelRequest" v-if="formState.isSubmitting">Annuler</v-btn>
    <v-progress-linear v-if="formState.isSubmitting" indeterminate color="primary"></v-progress-linear>
  </v-form>
</template>

<script lang="ts">

import {z} from "zod";

const stockSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().min(0),
  type: z.string()
});

import {computed, defineComponent, onMounted, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {useCategoryStore} from "@/stores/categories.ts";
import {useForm} from "@/composables/useForm.ts";
import { VNumberInput } from 'vuetify/labs/VNumberInput'

export default defineComponent({
  name: 'AdminProductStockForm',
  components: {
    VNumberInput
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useCategoryStore();

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
      productId: {
        value: productId,
      },
      quantity: {
        value: 0,
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

    const { formState, submitForm, cancelRequest, rules, initData } = useForm(initialData, stockSchema);

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