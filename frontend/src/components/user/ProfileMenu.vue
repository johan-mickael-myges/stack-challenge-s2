<template>
    <v-navigation-drawer app>
      <v-list dense>
        <v-list-item
          :to="{ name: 'UserProfile' }"
          :class="{ 'active-link': $route.name === 'UserProfile' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>User Profile</v-list-item-title>
        </v-list-item>
        <v-list-item
          :to="{ name: 'UserOrders' }"
          :class="{ 'active-link': $route.name === 'UserOrders' }"
        >
          <v-list-item-icon>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Orders</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .active-link {
    font-weight: bold;
  }
  </style>
  