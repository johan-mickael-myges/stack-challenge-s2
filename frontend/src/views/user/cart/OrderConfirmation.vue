<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Votre commande est passée</h1>
          <p>Vous recevrez prochainement un mail de confirmation.</p>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'OrderConfirmation',
  });
  </script>
  
  <style scoped>
  </style>
  