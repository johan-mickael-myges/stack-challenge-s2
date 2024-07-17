<script setup lang="ts">
import CookieConsent from './components/cookies/CookieConsent.vue';
</script>

<template>
  <v-app>
    <router-view></router-view>
    <CookieConsent />
  </v-app>
</template>