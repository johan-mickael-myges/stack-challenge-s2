<template>
  <v-form ref="productForm" @submit.prevent="handleSubmit" :model-value="true" lazy-validation enctype="multipart/form-data">
    <v-text-field
        v-model="formState.data.name.value"
        label="Nom"
        required
        :rules="rules.name"
        :error-messages="formState.validationErrors?.name?.join(' | ')"
    >
    </v-text-field>

    <v-text-field
        v-model="formState.data.reference.value"
        label="Référence"
        required
        :rules="rules.reference"
        :error-messages="formState.validationErrors?.reference?.join(' | ')"
    >
    </v-text-field>

    <v-textarea
        v-model="formState.data.description.value"
        label="Description"
        :error-messages="formState.validationErrors?.description?.join(' | ')"
    >
    </v-textarea>

    <v-text-field
        v-model.number="formState.data.price.value"
        label="Prix"
        required
        :rules="rules.price"
        :error-messages="formState.validationErrors?.price?.join(' | ')"
    >
    </v-text-field>

    <v-file-input
        v-model="formState.data.thumbnail.value"
        label="Miniature"
        accept="image/*"
        :rules="rules.thumbnail"
        :error-messages="formState.validationErrors?.thumbnail?.join(' | ')"
    >
    </v-file-input>
    <v-img v-if="isEditing" :src="product?.thumbnail" width="200" height="200"></v-img>

    <v-file-input
        v-model="formState.data.images.value"
        label="Images"
        multiple
        accept="image/*"
        :rules="rules.images"
        :error-messages="formState.validationErrors?.images?.join(' | ')"
    >
    </v-file-input>
    <v-img v-if="isEditing" v-for="(image, key) in product?.images" :key="'product-' + product?.id + '-images-' + key" :src="image" width="100" height="100"></v-img>

    <v-btn type="submit" color="primary" :disabled="!valid || formState.isSubmitting">Enregistrer</v-btn>
    <v-btn color="gray" variant="text" @click="cancelRequest" v-if="formState.isSubmitting">Annuler</v-btn>
    <v-progress-linear v-if="formState.isSubmitting" indeterminate color="primary"></v-progress-linear>
    <v-alert v-if="formState.httpError" type="error">{{ formState.httpError }}</v-alert>
  </v-form>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
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
  thumbnail: z.union([z.instanceof(File), z.string().url()]),
  images: z.array(z.union([z.instanceof(File), z.string().url()])).optional()
});

export default defineComponent({
  name: 'ProductForm',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useProductStore();

    const initialData = {
      id: {
        value: undefined,
      },
      brandId: {
        value: undefined,
      },
      name: {
        value: '',
        rules: [
          (v: string) => !!v || 'Le nom est requis',
          (v: string) => v.length >= 3 || 'Le nom doit comporter au moins 3 caractères',
          (v: string) => v.length <= 255 || 'Le nom doit comporter au plus 255 caractères',
        ],
        transform: (v: string) => v.toUpperCase(),
      },
      reference: {
        value: '',
        rules: [
          (v: string) => !!v || 'La référence est requise',
          (v: string) => v.length >= 3 || 'La référence doit comporter au moins 3 caractères',
          (v: string) => v.length <= 20 || 'La référence doit comporter au plus 20 caractères',
        ]
      },
      description: {
        value: '',
      },
      price: {
        value: 0,
        rules: [
          (v: number) => v >= 0 || 'Le prix doit être supérieur ou égal à 0'
        ]
      },
      thumbnail: {
        value: null,
      },
      images: {
        value: [],
      },
    };

    const valid = ref(true);
    const { formState, submitForm, cancelRequest, rules, initData } = useForm(initialData, productSchema);

    const handleSubmit = () => {
      submitForm(async (data, signal) => {
        const productId = Number(data.id);
        const formData = new FormData();

        for (const key in data) {
          if (data[key] === null || data[key] === undefined) {
            continue;
          }
          if (key === 'images') {
            data.images.forEach((image) => {
              formData.append('images', image);
            });
          } else {
            formData.append(key, data[key]);
          }
        }

        if (productId) {
          await store.updateProduct(productId, formData, signal);
        } else {
          await store.createProduct(formData, signal);
        }
        router.push('/admin/products');
      });
    };

    const isEditing = () => {
      return !!route.params.id;
    };

    onMounted(() => {
      if (isEditing()) {
        store.fetchProduct(Number(route.params.id)).then(() => {
          initData(store.product, rules())
        });
      }
    });

    return { formState, handleSubmit, cancelRequest, rules: rules(), valid, isEditing: isEditing(), product: computed(() => store.product) };
  },
});
</script>
