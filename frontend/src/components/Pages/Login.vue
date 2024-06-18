<script lang="ts">

import {defineComponent} from 'vue';
import CenteredContainer from "@/components/Container/CenteredContainer.vue";

export default defineComponent({
  name: 'Login',
  components: {CenteredContainer},
  props: {
    type: {
      type: String,
      required: true,
      default: 'user',
      validator: (value: string) => ['admin', 'user'].includes(value)
    },
    email: {
      type: String,
      required: true,
      default: ''
    },
    password: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup(props) {
    let subtitle = 'Enter your credentials';
    if (props.type === 'admin') {
      subtitle = 'Enter your admin credentials to access the dashboard.';
    }

    return {
      subtitle,
    };
  },
});

</script>

<template>
  <v-card
    class="mx-auto"
    :subtitle="subtitle"
    width="500"
  >
    <template v-slot:title>
      <span class="font-weight-black">Login</span>
    </template>

    <v-card-text>
      <v-form>
        <v-text-field label="Email" type="email" v-model="email" required></v-text-field>
        <v-text-field label="Mot de passe" type="password" v-model="password" required></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block variant="flat">Connexion</v-btn>
    </v-card-actions>
  </v-card>
</template>