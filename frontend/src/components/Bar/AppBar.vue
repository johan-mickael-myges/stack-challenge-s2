<script setup lang="ts">
import { useGoToUrl } from "@/composables/useGoToUrl.ts";
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.ts";
import {useCartStore} from "@/stores/cart.ts";
import LogoutButton from "@/components/Button/LogoutButton.vue";

const { goToByName } = useGoToUrl();
const authStore = useAuthStore();
const apiUser = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);

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
    router.push({ path: '/profile/info' }); 
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
  <v-app-bar id="navbar" elevation="1" height="80" class="px-8">
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
        <v-btn icon @click="goToProfile">
          <v-icon>mdi-account-outline</v-icon>
        </v-btn>

        <v-btn icon @click="goToOrder">
          <v-icon>mdi-package-variant</v-icon>
        </v-btn>

        <v-btn icon @click="goToCart">
          <v-badge v-if="countCartItem > 0" color="error" :content="countCartItem">
            <v-icon>mdi-cart-outline</v-icon>
          </v-badge>
          <v-icon v-else>mdi-cart-outline</v-icon>
        </v-btn>

        <LogoutButton v-if="isAuthenticated">
          <v-btn icon>
            <v-icon>mdi-power</v-icon>
          </v-btn>
        </LogoutButton>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<style scoped>
strong {
  color: black;
}

.user-info-container {
  margin-top: 20px;
}

.user-card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
}

.user-card-title {
  background-color: #f5f5f5;
  padding: 16px;
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-icon {
  margin-right: 8px;
  font-size: 24px;
}
</style>
