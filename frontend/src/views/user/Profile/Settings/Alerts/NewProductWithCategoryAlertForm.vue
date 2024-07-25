<template>
  <div>
    <v-switch
        v-model="enabled"
        density="comfortable"
        color="black"
        :label="label"
        @change="saveAlertPreference"
    />
    <v-autocomplete
        chips
        label="Choisissez les produits pour lesquels vous souhaitez recevoir des alertes"
        v-model="chosenProducts"
        :items="choices"
        item-title="text"
        item-value="value"
        multiple
        :disabled="!enabled"
    ></v-autocomplete>
    <v-btn v-if="enabled" @click="saveAlertItemPreference" variant="tonal" :loading="buttonLoading">
      Sauvegarder
    </v-btn>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useAlertStore } from "@/stores/alert.ts";
import { useProductStore } from "@/stores/products.ts";
import {useCategoryStore} from "@/stores/categories.ts";

const ALERT_ID = 1;

export default defineComponent({
  name: "NewProductWithCategoryAlertForm",
  setup() {
    const alertStore = useAlertStore();
    const categoryStore = useCategoryStore();
    const buttonLoading = ref(false);

    const enabled = ref(false);
    const label = ref("Je souhaite recevoir les alertes des nouveaux produits dans les catégories suivantes");
    const chosenCategories = ref<number[]>([]);
    const choices = computed(() => {
      return categoryStore.categories.map((category) => ({
        text: `${category.name}`,
        value: category.id,
      }));
    });

    onMounted(async () => {
      const fetchedAlertPreference = await alertStore.getAlertPreference(ALERT_ID);
      if (fetchedAlertPreference) {
        enabled.value = fetchedAlertPreference.enabled;
        chosenCategories.value = fetchedAlertPreference.alertItemPreferences.map((alertItemPreference) => alertItemPreference.itemId);
      }
    });

    watch(enabled, (newVal) => {
      label.value = newVal
          ? "Je souhaite recevoir les alertes des nouveaux produits dans les catégories suivantes"
          : "Je ne souhaite pas recevoir les alertes des nouveaux produits";
    });

    const saveAlertPreference = async () => {
      await alertStore.saveAlertPreference(ALERT_ID, enabled.value);
    };

    const saveAlertItemPreference = async () => {
      buttonLoading.value = true;
      await alertStore.saveAlertItemPreference(ALERT_ID, chosenCategories.value, enabled.value);
      buttonLoading.value = false;
    };

    return {
      enabled,
      label,
      choices,
      chosenProducts: chosenCategories,
      saveAlertPreference,
      saveAlertItemPreference,
      buttonLoading,
    };
  },
});
</script>
