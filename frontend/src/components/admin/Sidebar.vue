<template>
  <v-navigation-drawer app>
    <v-list-item title="Moonshine" subtitle="Administration"></v-list-item>
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
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Sidebar',
  data() {
    return {
      items: [
        {title: 'Products', icon: 'mdi-view-list', to: {name: 'AdminProductList'}},
      ],
    };
  },
});
</script>
