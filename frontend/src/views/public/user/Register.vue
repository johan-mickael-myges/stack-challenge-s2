<script lang="ts">

import {defineComponent, reactive} from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Register from '@/components/Auth/Register.vue';
import {RegisterData} from "@/types";
import logo from '@/assets/layalin_logo.png';

export default defineComponent({
  name: 'RegisterPage',
  components: {Register, CenteredContainer},
  setup() {
    const data = reactive<RegisterData>({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      number: '',
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
      <Register :data="data">
        <template v-slot:header>
          <div class="flex justify-center py-4">
            <div>
              <v-img :src="logo" width="100"></v-img>
            </div>
          </div>
        </template>
        <template v-slot:content.additional>
          <div class="text-center">
            <p class="text-gray-600">You already have an account ?</p>
            <router-link to="/login">Login</router-link>
          </div>
        </template>
      </Register>
    </div>
  </CenteredContainer>
</template>