<template>
  <v-card
      class="shadow-lg border"
  >
    <v-list>
      <v-list-item
          :subtitle="currentUser?.email"
          :title="currentUser?.firstname + ' ' + currentUser?.lastname"
      >
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="grey-darken-4"
          @click="() => $router.push({ name: item.routeName })"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>

      <v-list-group value="Sécurité">
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              title="Sécurité"
          >
            <template v-slot:prepend>
              <v-icon icon="">mdi-cog</v-icon>
            </template>
          </v-list-item>
        </template>
        <v-list-item
            title="Modifier le mot de passe"
            @click="() => $router.push({ name: 'ChangePassword' })"
        ></v-list-item>
        <v-list-item
            @click="() => $router.push({ name: 'confirmationDelete' })"
        >
          <template v-slot:default>
            <v-list-item-title class="text-red-400">Supprimer le compte</v-list-item-title>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from "vue";
import {useAuthStore} from "@/stores/auth.ts";

export default defineComponent({
  name: "UserSettingsMenu",
  data() {
      return {
          items: [
              { icon: "mdi-account", text: "Informations Utilisateur", routeName: 'UserInfo' },
              { icon: "mdi-bell", text: "Gestion des alertes", routeName: 'UserAlerts' },
          ],
      };
  },
  setup() {
    const authStore = useAuthStore();
    const currentUser = computed(() => authStore.currentUser);

    onMounted(async () => {
      await authStore.fetchCurrentUser();
    });

    return { currentUser };
  },
});
</script>