<script lang="ts">

import {computed, defineComponent, ref} from 'vue';
import {RegisterData} from "@/types";
import {
  emailRules,
  firstnameRules,
  lastnameRules, numberRules,
  passwordMatchRule,
  passwordRules,
  usernameRules
} from "@/utils/validationRules.ts";
import {useAuthStore} from "@/stores/auth.ts";

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
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        password: '',
        confirmPassword: '',
      })
    }
  },
  setup(props) {
    const authStore = useAuthStore();

    const register = async () => {
      await authStore.register(props.data);
    };
    const loading = computed(() => authStore.loading);
    const errors = computed(() => authStore.errors);

    let subtitle = 'Enter your information to register.';
    if (props.type === 'admin') {
      subtitle = 'Enter your information to register as an admin.';
    }

    const valid = ref(true);

    const usernameValidationRules = computed(() => usernameRules());
    const firstNameValidationRules = computed(() => firstnameRules());
    const lastNameValidationRules = computed(() => lastnameRules());
    const numberValidationRules = computed(() => numberRules());
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
      loading,
      register,
      errors,
      subtitle,
      valid,
      usernameValidationRules,
      firstNameValidationRules,
      lastNameValidationRules,
      numberValidationRules,
      emailValidationRules,
      passwordValidationRules,
      passwordMatchValidationRules,
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
          <span class="font-weight-black">Register</span>
        </template>

        <v-card-text>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Username"
                    v-model="data.username"
                    :rules="usernameValidationRules"
                    :error-messages="errors.username && errors.username.map(e => e.msg)"
                    required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Email"
                    type="email"
                    v-model="data.email"
                    :rules="emailValidationRules"
                    :error-messages="errors.email && errors.email.map(e => e.msg)"
                    required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="First name"
                    v-model="data.firstname"
                    :rules="firstNameValidationRules"
                    :error-messages="errors.firstname && errors.firstname.map(e => e.msg)"
                    required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Last name"
                    v-model="data.lastname"
                    :rules="lastNameValidationRules"
                    :error-messages="errors.lastname && errors.lastname.map(e => e.msg)"
                    required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Password"
                    type="password"
                    v-model="data.password"
                    :rules="passwordValidationRules"
                    :error-messages="errors.password && errors.password.map(e => e.msg)"
                    required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Confirm password"
                    type="password"
                    v-model="data.confirmPassword"
                    :rules="passwordMatchValidationRules"
                    required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Phone number"
                    type="number"
                    v-model="data.number"
                    :rules="numberValidationRules"
                    :error-messages="errors.number && errors.number.map(e => e.msg)"
                    required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loading" color="primary" block variant="flat" @click="register">Validate</v-btn>
        </v-card-actions>
        <slot name="content.additional"></slot>
      </v-card>
    </v-container>
  </v-responsive>
</template>