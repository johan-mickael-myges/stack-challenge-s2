<script setup lang="ts">
  import {useGoToUrl} from "@/composables/useGoToUrl.ts";

  const {
    login
  } = useGoToUrl();
</script>

<template>
  <v-app-bar elevation="1" height="80" style="padding-left: 15px; padding-right: 15px;" >
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-btn icon >
      <v-icon size="20px">mdi-magnify</v-icon>
    </v-btn>

    <v-spacer></v-spacer>

    <v-app-bar-title class="font-weight-bold d-flex justify-center">
      LAYALIN
    </v-app-bar-title>  

    <v-spacer></v-spacer>

    <v-btn icon >
      <v-icon size="20px">mdi-heart-outline</v-icon>
    </v-btn>

    <v-btn icon @click="login">
      <v-icon size="20px">mdi-account-outline</v-icon>
    </v-btn>

    <v-btn icon >
      <v-icon size="20px">mdi-cart-outline</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>

.v-app-bar-title {
  letter-spacing: 3px;
}

</style>