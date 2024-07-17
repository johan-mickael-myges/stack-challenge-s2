<template>
    <div>
      <h1>User Profile</h1>
      <div v-if="user">
        <p>Name : {{ user.username }}</p>
        <p>Email : {{ user.email }}</p>
        <p>First Name : {{ user.firstname }}</p>
        <p>Last Name : {{ user.lastname }}</p>
        <p>Number : {{ user.number }}</p>
      </div>
      <p v-else>No user connected</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from "@/stores/auth";
  import { computed } from 'vue';
  import { User } from '@/types';
  
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  </script>
  