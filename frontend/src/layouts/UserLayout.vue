<template>
    <v-app class="font-sans">
      <AppBar/>
      <v-main>
        <router-view class="p-4"></router-view>
      </v-main>
    </v-app>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import AppBar from '@/components/Bar/AppBar.vue';
  
  export default defineComponent({
    name: 'AdminLayout',
    components: {
      AppBar,
    },
  });
  </script>