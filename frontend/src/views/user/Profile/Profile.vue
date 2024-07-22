<template>
    <div class="profile">
      <v-navigation-drawer app permanent>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list>
          <v-list-item :to="{ name: 'UserOrders' }" link>
            <v-list-item-icon>
              <v-icon>mdi-package-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Commandes</v-list-item-title>
          </v-list-item>
  
          <v-list-item :to="{ name: 'UserInfo' }" link>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Infos Utilisateur</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-main>
        <router-view></router-view>
      </v-main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '@/stores/auth.ts';
  const authStore = useAuthStore();
  </script>
  
  <style scoped>
  .profile {
    display: flex;
  }
  </style>