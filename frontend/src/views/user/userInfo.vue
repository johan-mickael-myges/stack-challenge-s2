<template>
  <div>
    <h2>Infos Utilisateur</h2>
    <v-list>
      <v-list-item v-if="user">
        <v-list-item-content>
          <v-list-item-title>Nom: {{ user.lastname }}</v-list-item-title>
          <v-list-item-subtitle>Prénom: {{ user.firstname }}</v-list-item-subtitle>
          <v-list-item-subtitle>Email: {{ user.email }}</v-list-item-subtitle>
          <v-list-item-subtitle>Numéro: {{ user.number }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-else>
        <v-list-item-content>
          <v-list-item-title>Chargement...</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { User } from '@/types'; 
import {useAuthStore} from '@/stores/auth';


//const user = ref<User | null>(null);


const {user} = useAuthStore();

console.log('user', user);


</script>
