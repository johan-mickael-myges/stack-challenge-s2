<template>
    <v-app class="font-sans">
      <AppBar/>
      <v-main class="mb-4">
        <router-view class="p-4"></router-view>
      </v-main>
      <Footer/>
    </v-app>
  </template>
  
  <script lang="ts">
  import {defineComponent, onBeforeMount} from 'vue';
  import AppBar from '@/components/Bar/AppBar.vue';
  import Footer from '@/components/Footer/Footer.vue';
  import {useAuthStore} from "@/stores/auth.ts";
  
  export default defineComponent({
    name: 'UserLayout',
    components: {
      AppBar,
      Footer,
    },
    setup() {
      const authStore = useAuthStore();

      onBeforeMount(() => {
        authStore.verifyAuth();
      });
    },
  });
  </script>