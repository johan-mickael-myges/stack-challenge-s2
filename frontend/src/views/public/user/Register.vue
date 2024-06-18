<script lang="ts">

import {defineComponent, reactive} from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Register from '@/components/Pages/Register.vue';
import {RegisterData} from "@/types";
import logo from '@/assets/layalin_logo.png';

export default defineComponent({
  name: 'RegisterPage',
  components: {Register, CenteredContainer},
  setup() {
    const data = reactive<RegisterData>({
      email: '',
      password: '',
      confirmPassword: '',
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
    <div class="flex justify-center mb-4">
      <div>
        <v-img :src="logo" width="100"></v-img>
      </div>
    </div>
    <Register :data="data">
      <template v-slot:content.additional>
        <div class="text-center">
          <p class="text-gray-600">You already have an account ?</p>
          <router-link to="/login">Login</router-link>
        </div>
      </template>
    </Register>
  </CenteredContainer>
</template>