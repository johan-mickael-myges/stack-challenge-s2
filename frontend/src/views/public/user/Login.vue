<script lang="ts">
import { defineComponent, reactive } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Login from "@/components/Pages/Login.vue";
import { LoginData } from '@/types/LoginData'; // Ensure this path is correct

export default defineComponent({
  name: 'LoginPage',
  components: { Login, CenteredContainer },
  setup() {
    const data = reactive<LoginData>({
      email: '',
      password: '',
    });

    return {
      data,
    };
  },
});
</script>

<template>
  <CenteredContainer>
    <Login :data="data">
      <template v-slot:content.additional>
        <div class="text-center">
          <p class="text-gray-700">Doesn't have an account yet ?</p>
          <router-link to="/register">Register</router-link>
        </div>
      </template>
    </Login>
  </CenteredContainer>
</template>