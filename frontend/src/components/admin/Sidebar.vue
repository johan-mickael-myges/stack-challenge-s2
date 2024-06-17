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
    <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        :to="item.to"
    >
      <template v-slot:prepend>
        <v-icon>{{ item.icon }}</v-icon>
      </template>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'Sidebar',
  data() {
    return {
      items: [
        {title: 'Products', icon: 'mdi-view-list', to: {name: 'AdminProductList'}},
        {title: 'Categories', icon: 'mdi-folder-outline', to: {name: 'AdminCategoryList'}},
      ],
    };
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
