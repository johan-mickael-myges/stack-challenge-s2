<script lang="ts">
import { defineComponent, reactive } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Login from "@/components/Pages/Login.vue";
import { LoginData } from '@/types';
import logo from '@/assets/layalin_logo.png';

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
  data() {
    return {
      logo,
    }
  },
});
</script>

<template>
  <CenteredContainer>
    <div class="shadow-lg shadow-gray-300 border">
      <Login :data="data">
        <template v-slot:header>
          <div class="flex justify-center py-4">
            <div>
              <v-img :src="logo" width="100"></v-img>
            </div>
          </div>
        </template>
        <template v-slot:content.additional>
          <div class="text-center">
            <p class="text-gray-600">Doesn't have an account yet ?</p>
            <router-link to="/register">Register</router-link>
          </div>
        </template>
      </Login>
    </div>
  </CenteredContainer>
</template>