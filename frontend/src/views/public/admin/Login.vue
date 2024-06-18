<script lang="ts">

import { defineComponent } from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";
import Login from "@/components/Pages/Login.vue";

export default defineComponent({
  name: 'LoginPage',
  components: {Login, CenteredContainer},
  setup() {
    return {};
  },
});

</script>

<template>
  <CenteredContainer>
    <Login password="" email="" type="admin" />
  </CenteredContainer>
</template>