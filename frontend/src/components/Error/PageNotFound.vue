<template>
  <CenteredContainer>
    <h1 class="text-4xl">
      Page non trouvée
    </h1>
    <p class="text-gray-700">
      La page que vous cherchez n'existe pas.
    </p>
    <router-link to="/">Retourner à l'accueil</router-link>
  </CenteredContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";

export default defineComponent({
  name: 'PageNotFound',
  components: { CenteredContainer },
});
</script>
