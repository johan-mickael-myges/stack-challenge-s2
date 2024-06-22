<script lang="ts">

import {defineComponent, reactive} from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Register from '@/components/Auth/Register.vue';
import {RegisterData} from "@/types";

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
});

</script>

<template>
    <v-responsive>
      <CenteredContainer>
        <div class="md:p-5 md:shadow-lg shadow-gray-300 md:border">
          <Register :data="data" type="admin">
            <template v-slot:content.additional>
              <div class="text-center">
                <p class="text-gray-600">You already have an account ?</p>
                <router-link to="/login/admin">Login</router-link>
              </div>
            </template>
          </Register>
        </div>
      </CenteredContainer>
    </v-responsive>
</template>