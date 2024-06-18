<template>
  <div class="h-screen flex justify-center items-center">
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CenteredContainer',
});
</script>