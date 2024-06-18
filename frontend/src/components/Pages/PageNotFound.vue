<template>
  <CenteredContainer>
    <h1 class="text-4xl">
      Page Not Found
    </h1>
    <p class="text-gray-700">
      The page you are looking for does not exist.
    </p>
    <router-link to="/">Go back to Home</router-link>
  </CenteredContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";

export default defineComponent({
  name: 'PageNotFound',
  components: {CenteredContainer},
});
</script>