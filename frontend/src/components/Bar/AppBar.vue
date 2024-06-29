<script setup lang="ts">
import { useGoToUrl } from "@/composables/useGoToUrl.ts";
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CustomAutocomplete from "./CustomAutocomplete.vue";
import CategoryButtons from "./CategoryButtons.vue";

const { goToByName } = useGoToUrl();
const login = () => goToByName('login');

const isSmallScreen = ref(false);
const isMediumScreen = ref(false);
const isLargerScreen = ref(false);

const items = ref(['item1', 'item2', 'item3']);
const categories = ref(['Bagues', 'Boucles d\'oreilles', 'Colliers', 'Bracelets', 'Montres']);

const handleResize = () => {
  isLargerScreen.value = window.innerWidth < 882;
  isMediumScreen.value = window.innerWidth < 802;
  isSmallScreen.value = window.innerWidth < 628;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <v-app-bar :elevation="isMediumScreen ? 1 : 0" height="80">
    <v-row class="align-center">

      <v-col>
        <v-row class="align-center">
          <v-btn class="pl-9">
            <v-icon size="20px">mdi-filter-outline</v-icon>
            <span class="text-lowercase">filtrer</span>
          </v-btn>
          <div v-if="!isLargerScreen" class="pt-6 pl-2 w-[20vw]">
            <CustomAutocomplete :items="items" :rounded="true" />
          </div>
        </v-row>
      </v-col>

      <v-col>
        <div v-if="isSmallScreen" class="d-flex justify-center">
          <img src="@/assets/layalin_logo.png" alt="Logo_Layalin" class="h-10">
        </div>
        <v-app-bar-title v-else class="font-weight-bold d-flex justify-center">
          LAYALIN
        </v-app-bar-title>
      </v-col>

      <v-col class=" pr-7 d-flex justify-end">
        <v-btn icon>
          <v-icon size="20px">mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn icon @click="login">
          <v-icon size="20px">mdi-account-outline</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon size="20px">mdi-cart-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
  {# @TODO mettre dynamiquement elements du menu, en fonction de la selection de la categorie de l'admin #}
  <v-app-bar v-if="!isMediumScreen" elevation="1" height="40" class="pb-3">
    <CategoryButtons :categories="categories" />
</v-app-bar>

<v-app-bar elevation="0" height="60" v-if="isLargerScreen">
  <div :class="[{'pt-[2.5vh]': !isMediumScreen, ['pt-[1vh]']: isMediumScreen}, 'w-full']">
    <CustomAutocomplete :items="items" />
  </div>
</v-app-bar>
</template>

<style scoped>
.v-app-bar-title {
  letter-spacing: 3px;
}
</style>
