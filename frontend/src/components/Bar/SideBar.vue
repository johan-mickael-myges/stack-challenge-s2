<template>
    <v-navigation-drawer v-model="drawer" app permanent>
      <v-list>
        <!-- Liens de la sidebar -->
        <v-list-item link to="/user-profile" @click="closeSidebarAndGo('UserProfile')">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/user-orders" @click="closeSidebarAndGo('UserOrders')">
          <v-list-item-icon>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Autres liens de la sidebar -->
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const drawer = ref(false);
  const router = useRouter();
  
  const closeSidebarAndGo = (routeName: string) => {
    drawer.value = false;
    router.push({ name: routeName });
  };
  </script>
  
  <style scoped>
  /* Styles spécifiques à votre sidebar */
  </style>
  