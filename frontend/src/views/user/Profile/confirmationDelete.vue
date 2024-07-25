<template>
  <v-card variant="text" class="shadow-lg border">
    <v-card-title class="confirmation-card-title">
      <p>
        <v-icon class="mr-2">mdi-lock</v-icon>
        <span>Confirmer la suppression du compte</span>
      </p>
    </v-card-title>
    <v-card-subtitle>
      <v-form @submit.prevent="confirmDeletion">
        <v-text-field
          v-model="password"
          label="Entrez votre mot de passe actuel"
          type="password"
          required
        ></v-text-field>
        <v-card-actions>
          <v-btn type="submit" color="red" variant="elevated" block>Supprimer</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-subtitle>
    <v-card-subtitle v-if="errorMessage" class="error-message">
      <v-alert type="error">{{ errorMessage }}</v-alert>
    </v-card-subtitle>
  </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
  
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  
  const confirmDeletion = async () => {
    try {
      await authStore.confirmDeletion(password.value);
      authStore.logout();
    } catch(error) {
      console.log(error);
      errorMessage.value = error;
    }
  };
  </script>

  