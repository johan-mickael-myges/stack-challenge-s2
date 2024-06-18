<script lang="ts">

import {defineComponent} from 'vue';
import {LoginData} from "@/types";

export default defineComponent({
  name: 'Login',
  props: {
    type: {
      type: String,
      required: false,
      default: 'user',
      validator: (value: string) => ['admin', 'user'].includes(value)
    },
    data: {
      type: Object as () => LoginData,
      required: true,
      default: () => ({
        email: '',
        password: '',
      })
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
      elevation="8"
      class="px-2 py-4"
      :subtitle="subtitle"
      width="400"
  >
    <template v-slot:title>
      <span class="font-weight-black">Login</span>
    </template>

    <v-card-text>
      <v-form>
        <v-text-field label="Email" type="email" v-model="data.email" required></v-text-field>
        <v-text-field label="Mot de passe" type="password" v-model="data.password" required></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block variant="flat">Login</v-btn>
    </v-card-actions>
    <slot name="content.additional"></slot>
  </v-card>
</template>