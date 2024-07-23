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
  import { defineComponent } from 'vue';
  import AppBar from '@/components/Bar/AppBar.vue';
  import Footer from '@/components/Footer/Footer.vue';
  
  export default defineComponent({
    name: 'AdminLayout',
    components: {
      AppBar,
      Footer,
    },
  });
  </script>