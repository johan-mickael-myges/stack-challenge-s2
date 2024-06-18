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
    <Register :data="data" type="admin"/>
  </CenteredContainer>
</template>