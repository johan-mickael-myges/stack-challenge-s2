<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <UserSettingsMenu />
      </v-col>
      <v-col cols="12" md="9">
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import UserSettingsMenu from "@/views/user/Profile/Settings/UserSettingsMenu.vue";

export default defineComponent({
  name: "UserSettingLayout",
  components: {UserSettingsMenu},
});
</script>