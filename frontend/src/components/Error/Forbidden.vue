<template>
  <CenteredContainer>
    <h1 class="text-4xl">
      Vous n'avez pas les droits nécessaires pour accéder à cette page.
    </h1>
    <router-link to="/">Retourner à l'accueil</router-link><br>
    <router-link to="/login">Se connecter</router-link>
  </CenteredContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";

export default defineComponent({
  name: 'Forbidden',
  components: { CenteredContainer },
});
</script>
