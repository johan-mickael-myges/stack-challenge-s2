<template>
  <v-card variant="text" class="shadow-lg border">
    <v-card-text v-if="user">
      <v-text-field
          v-model="user.email"
          label="Email"
          readonly
      ></v-text-field>
      <v-text-field
          v-model="user.firstname"
          label="Prénom"
          readonly
      ></v-text-field>
      <v-text-field
          v-model="user.lastname"
          label="Nom"
          readonly
      ></v-text-field>

      <v-text-field
          v-model="user.number"
          label="Téléphone"
          readonly
      ></v-text-field>
    </v-card-text>
    <v-card-subtitle v-else>
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.currentUser);

onMounted(async () => {
  await authStore.fetchCurrentUser();
});

const initiateAccountDeletion = () => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'confirmationDelete' });
  } else {
    console.log('erreur de redirection');
  }
};

const initiatePasswordModification = () => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'ChangePassword' });
  } else {
    console.log('erreur de redirection');
  }
};
</script>
