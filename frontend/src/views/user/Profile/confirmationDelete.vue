<template>
    <v-container class="confirmation-delete-container" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="confirmation-card" outlined>
            <v-card-title class="confirmation-card-title">
              <v-icon class="confirmation-icon">mdi-lock</v-icon>
              <span>Confirmer la Suppression du Compte</span>
            </v-card-title>
            <v-card-subtitle>
              <v-form @submit.prevent="confirmDeletion">
                <v-text-field
                  v-model="password"
                  label="Mot de passe"
                  type="password"
                  required
                ></v-text-field>
                <v-card-actions>
                  <v-btn type="submit" color="red">Confirmer la Suppression</v-btn>
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
  
  <style scoped>
  .confirmation-delete-container {
    margin-top: 20px;
  }
  
  .confirmation-card {
    padding: 16px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
  }
  
  .confirmation-card-title {
    background-color: #f5f5f5;
    padding: 16px;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .confirmation-icon {
    margin-right: 8px;
    font-size: 24px;
  }
  
  .error-message {
    color: red;
  }
  </style>
  