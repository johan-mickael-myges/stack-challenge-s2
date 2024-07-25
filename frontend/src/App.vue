<template>
  <v-app>
    <router-view></router-view>
    <CookieConsent />
  </v-app>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import CookieConsent from "@/components/cookies/CookieConsent.vue";

export default defineComponent({
  name: 'App',
  components: {
    CookieConsent,
  },
  setup() {

  },
});
</script>
