<template>
  <v-card variant="text" class="shadow-lg border mb-4">
    <v-card-title>
      <p>
        <span>Paramétrez vos alertes</span>
      </p>
    </v-card-title>
    <v-card-text>
      <NewsletterSubscriptionForm />
    </v-card-text>
  </v-card>
  <v-card variant="text" class="shadow-lg border mb-4">
    <v-card-title>
      <RefillProductAlertForm />
    </v-card-title>
  </v-card>
  <v-card variant="text" class="shadow-lg border mb-4">
    <v-card-title>
      <NewProductWithCategoryAlertForm />
    </v-card-title>
  </v-card>
  <v-card variant="text" class="shadow-lg border mb-4">
    <v-card-title>
      <ProductPriceChangedAlertForm />
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import NewsletterSubscriptionForm from "./Alerts/NewsletterSubscriptionForm.vue";
import RefillProductAlertForm from "@/views/user/Profile/Settings/Alerts/RefillProductForm.vue";
import NewProductWithCategoryAlertForm from "./Alerts/NewProductWithCategoryAlertForm.vue";
import ProductPriceChangedAlertForm from "./Alerts/ProductPriceChangedAlertForm.vue";
import {useCategoryStore} from "@/stores/categories.ts";
import {useProductStore} from "@/stores/products.ts";

export default defineComponent({
  name: "UserAlerts",
  components: {
    RefillProductAlertForm,
    NewsletterSubscriptionForm,
    NewProductWithCategoryAlertForm,
    ProductPriceChangedAlertForm,
  },
  setup(props, ctx) {
    const categoryStore = useCategoryStore();
    const productStore = useProductStore();

      onMounted(async () => {
        await productStore.fetchProducts({
          limit: '',
        });
        await categoryStore.fetchCategories();
      });

  },
});
</script>