<template>
  <v-container class="user-profile" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="6">
        <v-card class="user-card">
          <v-card-title class="user-card-title">
            <v-icon class="user-icon">mdi-account-circle</v-icon>
            <Heading>User Profile</Heading>
          </v-card-title>
          <v-card-text v-if="user">
            <v-row>
              <v-col cols="12">
                <p><strong>Name:</strong> {{ user.username }}</p>
              </v-col>
              <v-col cols="12">
                <p><strong>Email:</strong> {{ user.email }}</p>
              </v-col>
              <v-col cols="12">
                <p><strong>First Name:</strong> {{ user.firstname }}</p>
              </v-col>
              <v-col cols="12">
                <p><strong>Last Name:</strong> {{ user.lastname }}</p>
              </v-col>
              <v-col cols="12">
                <p><strong>Number:</strong> {{ user.number }}</p>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-btn color="primary" @click="logout">Logout</v-btn>
            </v-row>
          </v-card-text>
          <v-alert v-else type="info">
            No user connected
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { computed } from 'vue';
import Heading from '@/components/Typography/Heading.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error("Failed to logout", error);
  }
};
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full viewport height */
}

.user-card {
  border: 1px solid #1976d2; /* Blue border */
  background-color: #fff; /* White background */
}

.user-card-title {
  background-color: #bbdefb; /* Slightly darker blue */
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-card-title h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.user-icon {
  margin-right: 8px;
  font-size: 32px;
}

.user-card p {
  margin: 0;
  padding: 8px 0;
}
</style>
