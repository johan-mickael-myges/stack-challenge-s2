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

const ALERT_ID = 3;

export default defineComponent({
  name: "ProductPriceChangedAlertForm",
  setup() {
    const alertStore = useAlertStore();
    const productStore = useProductStore();
    const buttonLoading = ref(false);

    const enabled = ref(false);
    const label = ref("Je souhaite recevoir les alertes de change de prix de produits");
    const chosenProducts = ref<number[]>([]);
    const choices = computed(() => {
      return productStore.products.map((product) => ({
        text: `${product.name} - ${product.brand}`,
        value: product.originalId,
      }));
    });

    onMounted(async () => {
      const fetchedAlertPreference = await alertStore.getAlertPreference(ALERT_ID);
      if (fetchedAlertPreference) {
        enabled.value = fetchedAlertPreference.enabled;
        chosenProducts.value = fetchedAlertPreference.alertItemPreferences.map((alertItemPreference) => alertItemPreference.itemId);
      }
    });

    watch(enabled, (newVal) => {
      label.value = newVal
          ? "Je souhaite recevoir les alertes de change de prix de produits"
          : "Je ne souhaite pas recevoir les alertes de change de prix de produits";
    });

    const saveAlertPreference = async () => {
      await alertStore.saveAlertPreference(ALERT_ID, enabled.value);
    };

    const saveAlertItemPreference = async () => {
      buttonLoading.value = true;
      await alertStore.saveAlertItemPreference(ALERT_ID, chosenProducts.value, enabled.value);
      buttonLoading.value = false;
    };

    return {
      enabled,
      label,
      choices,
      chosenProducts,
      saveAlertPreference,
      saveAlertItemPreference,
      buttonLoading,
    };
  },
});
</script>