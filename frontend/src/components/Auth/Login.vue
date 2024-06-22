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
  <v-responsive>
    <v-container class="pa-0">
      <slot name="header"></slot>
      <v-card
          class="px-2 py-4 mx-auto"
          :subtitle="subtitle"
          max-width="600"
          elevation="0"
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
            <v-row>
              <v-col cols="12">
                <v-text-field
                    label="Email"
                    type="email"
                    v-model="data.email"
                    required
                    :rules="emailValidationRules"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Password"
                    type="password"
                    v-model="data.password"
                    required
                    :rules="passwordValidationRules"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block variant="flat">Login</v-btn>
        </v-card-actions>
        <slot name="content.additional"></slot>
      </v-card>
    </v-container>
  </v-responsive>
</template>