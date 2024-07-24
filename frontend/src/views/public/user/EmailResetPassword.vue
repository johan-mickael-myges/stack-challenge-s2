<template>
    <CenteredContainer class="d-flex justify-center align-center fill-height">
      <div class="shadow-lg shadow-gray-300 border pa-6 rounded-lg max-w-md mx-auto">
        <v-responsive>
          <v-container class="pa-0">
            <div class="d-flex justify-center mb-4">
              <v-img :src="logo" height="70" width="100"></v-img>
            </div>
            <v-card
              class="px-2 py-4 mx-auto"
              :subtitle="subtitle"
              max-width="600"
              elevation="0"
            >
              <template v-slot:title>
                <span class="font-weight-black">Réinitialisation du mot de passe</span>
              </template>
              <form @submit.prevent="requestPasswordReset">
                <v-text-field
                  v-model="email"
                  label="Adresse e-mail"
                  type="email"
                  required
                  outlined
                  class="mb-4"
                ></v-text-field>
                <div class="d-flex justify-center">
                  <v-btn
                    type="submit"
                    color="primary"
                    class="white--text"
                  >
                    Valider
                  </v-btn>
                </div>
              </form>
              <div v-if="message" class="mt-4">
                <p :class="{'text-red-500': isError, 'text-green-500': !isError}">{{ message }}</p>
              </div>
            </v-card>
          </v-container>
        </v-responsive>
      </div>
    </CenteredContainer>
  </template>
  
  <script>
  import { ref } from 'vue';
  import logo from '@/assets/layalin_logo.png';
  import { useAuthStore } from "@/stores/auth";
  
  export default {
    setup() {
      const email = ref('');
      const message = ref('');
      const isError = ref(false);
      const authStore = useAuthStore();
      const subtitle = 'Entrez votre adresse e-mail';
      
      const requestPasswordReset = async () => {
        try {
          const responseMessage = await authStore.sendEmailResetPassword(email.value);
          message.value = responseMessage;
          isError.value = false;
        } catch (error) {
          message.value = error.message;
          isError.value = true;
        }
      };
  
      return {
        email,
        message,
        isError,
        logo,
        subtitle,
        requestPasswordReset
      };
    }
  };
  </script>
  