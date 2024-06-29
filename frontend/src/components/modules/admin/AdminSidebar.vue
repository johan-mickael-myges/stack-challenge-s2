<template>
  <v-navigation-drawer
      :rail="rail"
      permanent
  >
    <div class="flex flex-row justify-between">
      <v-list-item v-if="!rail" title="Layalin" subtitle="Administration"></v-list-item>
      <v-list-item class="text-right">
        <v-icon @click="toggleRail">{{ menuIcon }}</v-icon>
      </v-list-item>
    </div>
    <v-divider></v-divider>
    <v-list :items="items" />
    <slot name="custom-items"></slot>
    <slot name="footer"></slot>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {AdminSidebarItem} from "@/types";

export default defineComponent({
  name: 'AdminSidebar',
  props: {
    items: {
      type: Object as () => AdminSidebarItem[],
      required: true,
    },
  },
  setup() {
    const rail = ref(false);
    const menuIcon = computed(() => (rail.value ? 'mdi-menu-close' : 'mdi-menu-open'));

    const toggleRail = () => {
      rail.value = !rail.value;
    };

    return {
      rail,
      menuIcon,
      toggleRail,
    };
  },
});
</script>
