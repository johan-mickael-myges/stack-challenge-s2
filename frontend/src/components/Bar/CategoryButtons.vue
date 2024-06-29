<template>
    <v-row class="justify-center max-w-4xl mx-auto">
      <v-col class="text-center" v-for="(category, index) in categories" :key="index">
        <v-btn text>{{ category }}</v-btn>
      </v-col>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps({
    categories: {
      type: Array,
      required: true
    }
  });
  </script>
  