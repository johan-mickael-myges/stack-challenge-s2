<template>
  <v-form
      ref="productForm"
      @submit.prevent="handleSubmit"
      :model-value="true"
      lazy-validation
      enctype="multipart/form-data"
  >
    <v-text-field
        v-model="formState.data.name.value"
        label="Nom"
        required
        :error-messages="formState.validationErrors?.name?.join(' | ')"
    >
    </v-text-field>

    <v-text-field
        v-model="formState.data.reference.value"
        label="Référence"
        required
        :error-messages="formState.validationErrors?.reference?.join(' | ')"
    >
    </v-text-field>

    <v-textarea
        v-model="formState.data.description.value"
        label="Description"
        :error-messages="formState.validationErrors?.description?.join(' | ')"
    >
    </v-textarea>

    <v-number-input
        v-model.number="formState.data.price.value"
        label="Prix"
        required
        :error-messages="formState.validationErrors?.price?.join(' | ')"
        :min="0"
    />

    <v-number-input
        v-model.number="formState.data.weight.value"
        label="Poids"
        required
        :error-messages="formState.validationErrors?.weight?.join(' | ')"
        :min="0"
    />

    <v-select
        v-model="formState.data.categories.value"
        label="Catégories"
        multiple
        :items="categories"
        item-title="name"
        item-value="id"
        required
        :error-messages="formState.validationErrors?.categories"
    />

    <v-select
        v-model="formState.data.brand.value"
        label="Marque"
        :items="brands"
        item-title="name"
        item-value="id"
        :error-messages="formState.validationErrors?.brand"
    />

    <v-select
        v-model="formState.data.colors.value"
        label="Couleurs"
        multiple
        :items="colors"
        item-title="name"
        item-value="id"
        :error-messages="formState.validationErrors?.colors"
    />

    <v-select
        v-model="formState.data.materials.value"
        label="Matières"
        multiple
        :items="materials"
        item-title="name"
        item-value="id"
        :error-messages="formState.validationErrors?.materials"
    />

    <file-input
        v-model="formState.data.thumbnail.value"
        label="Miniature"
        accept="image/*"
        :error-messages="formState.validationErrors?.thumbnail?.join(' | ')"
        chips
    />

    <file-input
        v-model="formState.data.images.value"
        label="Images"
        multiple
        accept="image/*"
        :error-messages="formState.validationErrors?.images?.join(' | ')"
        chips
    >
    </file-input>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-btn type="submit" color="primary" :disabled="!valid || formState.isSubmitting">Enregistrer</v-btn>
        <v-btn color="gray" variant="text" @click="cancelRequest" v-if="formState.isSubmitting">Annuler</v-btn>
      </v-col>
    </v-row>

    <v-progress-linear v-if="formState.isSubmitting" indeterminate color="primary"></v-progress-linear>
    <v-alert v-if="formState.httpError" type="error">{{ formState.httpError }}</v-alert>
  </v-form>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useForm} from '@/composables/useForm.ts';
import {z} from 'zod';
import {useProductStore} from '@/stores/products.ts';
import {useColorStore} from '@/stores/colors';
import {VNumberInput} from "vuetify/labs/VNumberInput";
import {useMaterialStore} from "@/stores/materials.ts";
import {useCategoryStore} from "@/stores/categories.ts";
import {useBrandStore} from "@/stores/brands.ts";
import FileInput from '@/components/Form/FileInput.vue';

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, 'Le nom doit comporter au moins 3 caractères').max(255, 'Le nom doit comporter au plus 255 caractères'),
  reference: z.string().min(3, 'La référence doit comporter au moins 3 caractères').max(20, 'La référence doit comporter au plus 20 caractères'),
  description: z.string().optional(),
  price: z.number().gt(0, 'Le prix doit être supérieur à 0'),
  weight: z.number().gt(0, 'Le poids doit être supérieur à 0'),
  brand: z.number().gt(0, 'La marque est requise'),
  categories: z.array(z.number()).min(1, 'Au moins une catégorie est requise'),
  colors: z.array(z.number()).min(1, 'Au moins une couleur est requise'),
  materials: z.array(z.number()).min(1, 'Au moins une matière est requise'),
  thumbnail: z.union([z.instanceof(File), z.string().url()]),
  images: z.array(z.union([z.instanceof(File), z.string().url()])).optional()
});

export default defineComponent({
  name: 'ProductForm',
  components: {
    VNumberInput,
    FileInput
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useProductStore();
    const categoryStore = useCategoryStore();
    const brandStore = useBrandStore();
    const colorStore = useColorStore();
    const materialStore = useMaterialStore();

    const initialData = {
      id: {
        value: undefined,
      },
      brandId: {
        value: undefined,
      },
      name: {
        value: '',
        transform: (value: string) => value.trim(),
      },
      reference: {
        value: '',
        transform: (value: string) => value.trim(),
      },
      description: {
        value: '',
        transform: (value: string) => value.trim(),
      },
      price: {
        value: 0,
        transform: (value: string) => Number(value),
      },
      weight: {
        value: 0,
        transform: (value: string) => Number(value),
      },
      brand: {
        value: undefined,
        transform(value) {
          return value.id ? value.id : value;
        },
      },
      categories: {
        value: [],
        transform(value) {
          if (value[0].id) {
            return value.map((category) => category.id);
          } else {
            return value;
          }
        }
      },
      colors: {
        value: [],
        transform(value) {
          if (value[0].id) {
            return value.map((color) => color.id);
          } else {
            return value;
          }
        }
      },
      materials: {
        value: [],
        transform(value) {
          if (value[0].id) {
            return value.map((material) => material.id);
          } else {
            return value;
          }
        }
      },
      thumbnail: {
        value: null,
      },
      images: {
        value: [],
      },
    };

    const valid = ref(true);
    const {formState, submitForm, cancelRequest, initData} = useForm(initialData, productSchema);

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
              if (image instanceof File) {
                formData.append('images', image);
              }
            });
          } else if (key === 'thumbnail') {
            if (data.thumbnail instanceof File) {
              formData.append('thumbnail', data.thumbnail);
            }
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

    onMounted(async () => {
      await brandStore.fetchBrands();
      await categoryStore.fetchCategories();
      await colorStore.fetchColors();
      await materialStore.fetchMaterials();
      if (isEditing()) {
        store.fetchProduct(Number(route.params.id)).then(() => {
          initData(store.product, initialData);
        });
      }
    });

    return {
      formState,
      handleSubmit,
      cancelRequest,
      valid,
      isEditing: isEditing(),
      product: computed(() => store.product),
      brands: computed(() => brandStore.brands),
      categories: computed(() => categoryStore.categories),
      colors: computed(() => colorStore.colors),
      materials: computed(() => materialStore.materials),
    };
  },
});
</script>
