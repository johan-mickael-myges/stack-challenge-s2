<template>
  <v-card variant="text" class="shadow-lg border">
    <v-card-title class="password-modif-card-title">
      <p>
        <v-icon class="mr-2">mdi-lock-reset</v-icon>
        <span>Modification du mot de passe</span>
      </p>
    </v-card-title>
    <v-card-subtitle>
      <v-form @submit.prevent="changePassword">
        <v-text-field
          v-model="currentPassword"
          label="Mot de passe actuel"
          type="password"
          required
        ></v-text-field>
        <v-text-field
          v-model="newPassword"
          label="Nouveau mot de passe"
          type="password"
          required
        ></v-text-field>
        <v-text-field
          v-model="confirmNewPassword"
          label="Confirmer le nouveau mot de passe"
          type="password"
          required
        ></v-text-field>
        <v-card-actions>
          <v-btn block type="submit" color="grey-darken-4" variant="elevated">Valider</v-btn>
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
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmNewPassword = ref ('');
  const errorMessage = ref('');
  const router = useRouter();
  const authStore = useAuthStore();
  
  const changePassword = async () => {
    try {
      const response = await authStore.changePassword(currentPassword.value, newPassword.value, confirmNewPassword.value );
      authStore.logout();
    } catch (error) {
        if (error.response?.data) {
            errorMessage.value = error.response.data;
        } else {
            errorMessage.value = error.message || 'Une erreur s\'est produite';
        }
    }
  };
  </script>
  