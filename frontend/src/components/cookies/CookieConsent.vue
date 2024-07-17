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
  
  export default defineComponent({
    name: 'CookieConsent',
    setup() {
      const show = ref(false);
  
      onMounted(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
          show.value = true;
        }
      });
  
      const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        show.value = false;
      };
  
      const rejectCookies = () => {
        localStorage.setItem('cookiesAccepted', 'false');
        show.value = false;
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
  