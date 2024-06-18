<script lang="ts">

import {defineComponent, ref} from 'vue';
import {LoginData} from "@/types";
import {emailRules, passwordRules} from "@/utils/validationRules.ts";

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

    const valid = ref(true);

    const emailValidationRules = emailRules();
    const passwordValidationRules = passwordRules({
      required: true,
    });

    return {
      subtitle,
      valid,
      emailValidationRules,
      passwordValidationRules,
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
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
      >
        <v-text-field
            label="Email"
            type="email"
            v-model="data.email"
            required
            :rules="emailValidationRules"
            clearable
        />
        <v-text-field
            label="Password"
            type="password"
            v-model="data.password"
            required
            :rules="passwordValidationRules"
            clearable
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block variant="flat">Login</v-btn>
    </v-card-actions>
    <slot name="content.additional"></slot>
  </v-card>
</template>