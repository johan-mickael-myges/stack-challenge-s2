<template>
  <v-app class="font-sans">
    <Sidebar />
    <v-main>
      <router-view class="p-4"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '@/components/admin/Sidebar.vue';

export default defineComponent({
  name: 'AdminLayout',
  components: {
    Sidebar,
  },
});
</script>