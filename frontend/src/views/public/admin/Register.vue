<script lang="ts">

import {defineComponent, reactive} from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Register from '@/components/Pages/Register.vue';
import {RegisterData} from "@/types";

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
});

</script>

<template>
  <CenteredContainer>
    <Register :data="data" type="admin">
      <template v-slot:content.additional>
        <div class="text-center">
          <p class="text-gray-600">You already have an account ?</p>
          <router-link to="/login/admin">Login</router-link>
        </div>
      </template>
    </Register>
  </CenteredContainer>
</template>