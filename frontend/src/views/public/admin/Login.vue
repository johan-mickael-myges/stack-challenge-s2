<script lang="ts">
import { defineComponent, reactive } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Login from "@/components/Pages/Login.vue";
import { LoginData } from '@/types';

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
    <div class="md:p-5 md:shadow-lg shadow-gray-300 md:border">
      <Login :data="data" type="admin">
        <template v-slot:content.additional>
          <div class="text-center">
            <p class="text-gray-600">Doesn't have an account yet ?</p>
            <router-link to="/register/admin">Register</router-link>
          </div>
        </template>
      </Login>
    </div>
  </CenteredContainer>
</template>