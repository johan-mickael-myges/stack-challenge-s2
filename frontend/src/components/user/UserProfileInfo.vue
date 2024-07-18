<template>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>User Profile Information</v-card-title>
            <v-card-text>
              <p><strong>Username:</strong> {{ user.username }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>First Name:</strong> {{ user.firstname }}</p>
              <p><strong>Last Name:</strong> {{ user.lastname }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '../../stores/auth';
  
  const user = ref({});
  const authStore = useAuthStore();
  
  onMounted(async () => {
    await authStore.fetchUser();
    user.value = authStore.user;
  });
  </script>
  
  <style scoped>
  </style>
  