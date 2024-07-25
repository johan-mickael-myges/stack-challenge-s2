<script setup lang="ts">
import { useGoToUrl } from "@/composables/useGoToUrl.ts";
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.ts";
import {useCartStore} from "@/stores/cart.ts";
import LogoutButton from "@/components/Button/LogoutButton.vue";
import LoginButton from "@/components/Button/LoginButton.vue";

const { goToByName } = useGoToUrl();
const authStore = useAuthStore();
const isAuthenticated = (computed(() => authStore.isAuthenticated));

const cartStore = useCartStore();
const countCartItem = computed(() => cartStore.countCartItem);

const isSmallScreen = ref(false);
const isMediumScreen = ref(false);
const isLargerScreen = ref(false);

const handleResize = () => {
  isLargerScreen.value = window.innerWidth < 882;
  isMediumScreen.value = window.innerWidth < 802;
  isSmallScreen.value = window.innerWidth < 628;
};

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  handleResize();

  await authStore.verifyAuth();

  if (authStore.isAuthenticated) {
    await cartStore.fetchCart();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const router = useRouter();

const goToProfile = () => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'UserInfo' });
  } else {
    goToByName('login');
  }
};

const goToOrder = () => {
  if (authStore.isAuthenticated) {
    router.push({ path: '/paid-orders' });
  } else {
    goToByName('login');
  }
};

const goToCart = () => router.push({ name: 'UserCart' });

const goToHome = () => router.push('/');

</script>

<template>
  <v-app-bar id="navbar" elevation="1" height="80" class="px-8 bg-green-500" color="grey-darken-4">
    <v-row class="align-center">
      <v-col>
        <div v-if="isSmallScreen">
          <img src="@/assets/layalin_logo.png" alt="Logo_Layalin" class="h-10" @click="goToHome"> <!-- Make the logo clickable -->
        </div>
        <v-app-bar-title v-else class="font-weight-bold cursor-pointer" @click="goToHome"> <!-- Make the text clickable -->
          LAYALIN
        </v-app-bar-title>
      </v-col>

      <v-col class="d-flex justify-end">
        <v-btn v-if="isAuthenticated" icon @click="goToProfile">
          <v-icon>mdi-account-outline</v-icon>
        </v-btn>

        <v-btn v-if="isAuthenticated" icon @click="goToOrder">
          <v-icon>mdi-package-variant</v-icon>
        </v-btn>

        <v-btn v-if="isAuthenticated"icon @click="goToCart">
          <v-badge v-if="countCartItem > 0" color="error" :content="countCartItem">
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-cart-outline</v-icon>
        </v-btn>

        <v-tooltip v-if="isAuthenticated" bottom text="Déconnexion">
          <template v-slot:activator="{ props }">
            <LogoutButton v-bind="props" >
              <v-btn icon>
                <v-icon>mdi-power</v-icon>
              </v-btn>
            </LogoutButton>
          </template>
        </v-tooltip>
        <v-tooltip  v-else bottom text="Connexion">
          <template v-slot:activator="{ props }">
            <LoginButton v-bind="props">
              <v-btn icon>
                <v-icon>mdi-login</v-icon>
              </v-btn>
            </LoginButton>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-app-bar>
</template>