<script setup lang="ts">
import { useGoToUrl } from "@/composables/useGoToUrl.ts";
import { ref, onMounted, onBeforeUnmount } from 'vue';
import CustomAutocomplete from "./CustomAutocomplete.vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.ts";

const { goToByName } = useGoToUrl();
const login = () => goToByName('login');
const authStore = useAuthStore();


const isSmallScreen = ref(false);
const isMediumScreen = ref(false);
const isLargerScreen = ref(false);

const items = ref(['item1', 'item2', 'item3']);

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

const goToProfile = () => {
  if (authStore.isAuthenticated) {
    router.push({ path: '/profile/info' }); // Par défaut, affichez les commandes
  } else {
    goToByName('login');
  }
};

const router = useRouter();
const goToCart = () => router.push({ name: 'UserCart' });
const goToHome = () => router.push('/'); 

</script>

<template>
  <v-app-bar id="navbar" elevation="1" height="80" class="px-8">
    <v-row class="align-center">
      <v-col>
        <div v-if="isSmallScreen">
          <img src="@/assets/layalin_logo.png" alt="Logo_Layalin" class="h-10" @click="goToHome"> <!-- Make the logo clickable -->
        </div>
        <v-app-bar-title v-else class="font-weight-bold" @click="goToHome"> <!-- Make the text clickable -->
          LAYALIN
        </v-app-bar-title>
      </v-col>

      <v-col class="d-flex justify-end">
        <v-btn icon>
          <v-icon size="20px">mdi-heart-outline</v-icon>
        </v-btn>

        <v-btn icon @click="goToProfile">
          <v-icon size="20px">mdi-account-outline</v-icon>
        </v-btn>

        <v-btn icon @click="goToCart">
          <v-icon size="20px">mdi-cart-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<style scoped>
.v-app-bar-title {
  letter-spacing: 3px;
  cursor: pointer; 
}
</style>
