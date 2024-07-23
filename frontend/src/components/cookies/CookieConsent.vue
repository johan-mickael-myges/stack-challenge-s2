<template>
  <div v-if="show" class="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 text-white flex justify-between items-center">
    <span>
      Nous utilisons des cookies pour améliorer votre expérience sur notre site. En utilisant notre site, vous acceptez notre utilisation des cookies.
      <router-link to="/privacy-policy" class="underline text-white">En savoir plus</router-link>.
    </span>
    <div>
      <v-btn color="primary" @click="acceptCookies">Accepter</v-btn>
      <v-btn color="secondary" @click="rejectCookies">Rejeter</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from '@/config/axios';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'CookieConsent',
  setup() {
    const show = ref(false);
    const authStore = useAuthStore();

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        try {
          const response = await apiClient.get(`/auth/cookies`);
          if (response.data.cookiesAccepted === null) {
            show.value = true;
          }
        } catch (error) {
          console.error('Failed to fetch cookie preference:', error);
        }
      }
    });

    const updateCookiePreference = async (accepted: boolean) => {
      show.value = false;
      if (authStore.isAuthenticated) {
        try {
          await apiClient.patch(`/auth/cookies`, { cookiesAccepted: accepted });
          authStore.user.cookiesAccepted = accepted;
        } catch (error) {
          console.error('Failed to update cookie preference:', error);
        }
      }
    };

    const acceptCookies = () => {
      updateCookiePreference(true);
    };

    const rejectCookies = () => {
      updateCookiePreference(false);
    };

    return {
      show,
      acceptCookies,
      rejectCookies,
    };
  },
});
</script>

<style scoped>
.fixed {
  position: fixed;
  background-color: #2d3748;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}
</style>
