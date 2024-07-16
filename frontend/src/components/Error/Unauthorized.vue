<template>
  <CenteredContainer>
    <h1 class="text-4xl">
      Vous n'avez pas la permission d'accéder à cette page.
    </h1>
    <p class="text-gray-700">
      Vous devez être connecté avec vos identifiants pour accéder à cette page.
    </p>
    <router-link to="/">Retourner à l'accueil</router-link>
  </CenteredContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";

export default defineComponent({
  name: 'Unauthorized',
  components: { CenteredContainer },
});
</script>
