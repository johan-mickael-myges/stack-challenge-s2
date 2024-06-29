<template>
  <div @click="handleLogout" class="cursor-pointer">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'LogoutButton',
  setup() {
    const authStore = useAuthStore();

    const handleLogout = () => {
      authStore.logout();
    };

    return {
      handleLogout,
    };
  },
});
</script>
