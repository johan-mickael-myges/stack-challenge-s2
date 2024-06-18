<script lang="ts">

import {computed, defineComponent, ref} from 'vue';
import {RegisterData} from "@/types";
import {emailRules, passwordMatchRule, passwordRules} from "@/utils/validationRules.ts";

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

    const valid = ref(true);

    const emailValidationRules = emailRules();
    const passwordValidationRules = passwordRules({
      required: true,
      minLength: 8,
      uppercase: true,
      lowercase: true,
      digit: true,
      specialChar: true,
    });
    const passwordMatchValidationRules = computed(() => passwordMatchRule(props.data.password));

    return {
      subtitle,
      valid,
      emailValidationRules,
      passwordValidationRules,
      passwordMatchValidationRules,
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
            label="Mot de passe"
            type="password"
            v-model="data.password"
            required
            :rules="passwordValidationRules"
            clearable
        />
        <v-text-field
            label="Confirm password"
            type="password"
            v-model="data.confirmPassword"
            required
            :rules="passwordMatchValidationRules"
            clearable
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block variant="flat">Validate</v-btn>
    </v-card-actions>
    <slot name="content.additional"></slot>
  </v-card>
</template>