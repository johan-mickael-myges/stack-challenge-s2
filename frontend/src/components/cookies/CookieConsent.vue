<template>
  <div>
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
    <v-btn class="fixed bottom-20 left-1/2 transform -translate-x-1/2 m-4" color="error" @click="resetCookies">Réinitialiser les cookies</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.ts';

export default defineComponent({
  name: 'CookieConsent',
  setup() {
    const show = ref(false);
    const authStore = useAuthStore();

    onMounted(() => {
      const cookiesAccepted = localStorage.getItem('cookiesAccepted');
      if (!cookiesAccepted && authStore.user.id) {
        show.value = true;
      }
    });

    const updateCookiePreference = async (accepted: boolean) => {
      localStorage.setItem('cookiesAccepted', accepted.toString());
      show.value = false;
      if (authStore.user.id) {
        try {
          await axios.patch(`http://localhost:8000/auth/${authStore.user.id}/cookies`, { cookiesAccepted: accepted });
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

    const resetCookies = () => {
      localStorage.removeItem('cookiesAccepted');
      show.value = true;
    };

    return {
      show,
      acceptCookies,
      rejectCookies,
      resetCookies,
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
