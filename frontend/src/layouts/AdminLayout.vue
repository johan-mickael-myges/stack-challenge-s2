<template>
  <v-app class="font-sans">
    <AdminSidebar :items="items">
      <template v-slot:custom-items>
        <v-divider></v-divider>
        <LogoutButton>
          <v-list-item prepend-icon="mdi-logout" >
            <v-list-item-title>Se déconnecter</v-list-item-title>
          </v-list-item>
        </LogoutButton>
      </template>
    </AdminSidebar>
    <v-main>
      <router-view class="p-4"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount} from 'vue';
import AdminSidebar from "@/components/modules/admin/AdminSidebar.vue";
import LogoutButton from "@/components/Button/LogoutButton.vue";
import {useAuthStore} from "@/stores/auth.ts";

export default defineComponent({
  name: 'AdminLayout',
  components: {
    AdminSidebar,
    LogoutButton,
  },
  data() {
    return {
      items: [
        {
          title: 'Produits',
          props: {
            to: {name: 'AdminProductList'},
            prependIcon: 'mdi-package-variant-closed',
            color: 'primary'
          }
        },
        {
          title: 'Categories',
          props: {
            to: {name: 'AdminCategoryList'},
            prependIcon: 'mdi-view-list',
            color: 'primary'
          }
        },
        {
          title: 'Marques',
          props: {
            to: {name: 'AdminBrandList'},
            prependIcon: 'mdi-octagram-plus-outline',
            color: 'primary'
          }
        },
        {
          title: 'Couleurs',
          props: {
            to: {name: 'AdminColorList'},
            prependIcon: 'mdi-format-color-fill',
            color: 'primary'
          }
        },
        {
          title: 'Matériaux',
          props: {
            to: {name: 'AdminMaterialList'},
            prependIcon: 'mdi-gold',
            color: 'primary'
          }
        },
      ],
    };
  },
  setup() {
      const authStore = useAuthStore();

      onBeforeMount(() => {
        authStore.checkAdmin();
      });
  },
});
</script>