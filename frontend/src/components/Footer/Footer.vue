<template>
    <v-footer app class="shadow-lg d-flex justify-center align-center pa-4">
      <v-container class="d-flex justify-center">
        <v-row>
          <v-col class="text-center">
            <span>© 2024 Layalin | </span>
            <router-link to="/privacy-policy" class="text-primary">Politique de confidentialité</router-link>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  };
  </script>
  