<template>
  <div @click="handleLogin" class="cursor-pointer">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'LoginButton',
  setup() {
    const router = useRouter();

    const handleLogin = () => {
      router.push({ path: 'login' });
    };

    return {
      handleLogin,
    };
  },
});
</script>
