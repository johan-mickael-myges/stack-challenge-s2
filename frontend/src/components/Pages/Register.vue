<script lang="ts">

import {defineComponent} from 'vue';
import {RegisterData} from "@/types";

export default defineComponent({
  name: 'Register',
  props: {
    type: {
      type: String,
      default: 'user',
      validator: (value: string) => ['admin', 'user'].includes(value)
    },
    data: {
      type: Object as () => RegisterData,
      required: true,
      default: () => ({
        email: '',
        password: '',
        confirmPassword: '',
      })
    }
  },
  setup(props) {
    let subtitle = 'Enter your information to register.';
    if (props.type === 'admin') {
      subtitle = 'Enter your information to register as an admin.';
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
      width="500"
  >
    <template v-slot:title>
      <span class="font-weight-black">Register</span>
    </template>

    <v-card-text>
      <v-form>
        <v-text-field label="Email" type="email" v-model="data.email" required></v-text-field>
        <v-text-field label="Mot de passe" type="password" v-model="data.password" required></v-text-field>
        <v-text-field label="Confirm password" type="password" v-model="data.confirmPassword" required></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block variant="flat">Validate</v-btn>
    </v-card-actions>
    <slot name="content.additional"></slot>
  </v-card>
</template>