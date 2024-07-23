<template>
    <v-container class="password-modif-container" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="password-modif-card" outlined>
            <v-card-title class="password-modif-card-title">
              <v-icon class="password-modif-icon">mdi-lock-reset</v-icon>
              <span>Modifier le Mot de Passe</span>
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
                  <v-btn type="submit" color="blue">Modifier le Mot de Passe</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-subtitle>
            <v-card-subtitle v-if="errorMessage" class="error-message">
              <v-alert type="error">{{ errorMessage }}</v-alert>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
  
  <style scoped>
  .password-modif-container {
    margin-top: 20px;
  }
  
  .password-modif-card {
    padding: 16px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
  }
  
  .password-modif-card-title {
    background-color: #f5f5f5;
    padding: 16px;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .password-modif-icon {
    margin-right: 8px;
    font-size: 24px;
  }
  
  .error-message {
    color: red;
  }
  </style>
  