<template>
    <CenteredContainer class="d-flex justify-center align-center fill-height">
      <div class="shadow-lg shadow-gray-300 border p-6 rounded-lg max-w-md mx-auto">
        <v-responsive>
          <v-container class="p-0">
            <div class="d-flex justify-center mb-4">
              <v-img :src="logo" height="70" width="100"></v-img>
            </div>
            <v-card v-if="tokenValid"               
                class="px-2 py-4 mx-auto"
                max-width="600"
                elevation="0">
              <v-card-title class="headline">Réinitialiser le Mot de Passe</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="resetPassword" v-model="valid">
                  <v-text-field
                    v-model="newPassword"
                    :rules="passwordRules"
                    label="Nouveau Mot de Passe"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="confirmPassword"
                    :rules="confirmPasswordRules"
                    label="Confirmer le Mot de Passe"
                    type="password"
                    required
                  ></v-text-field>
                  <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="mt-3"
                    @click="resetPassword"
                  >
                    Réinitialiser le Mot de Passe
                  </v-btn>
                </v-form>
                <v-alert v-if="message" :type="isError ? 'error' : 'success'" class="mt-3">
                  {{ message }}
                </v-alert>
              </v-card-text>
            </v-card>
            <v-card v-else
                class="px-2 py-4 mx-auto"
                max-width="600"
                elevation="0">
              <v-card-title class="headline text-red--text">Lien invalide</v-card-title>
              <v-card-text class="grey--text">
                Le lien de réinitialisation de mot de passe est invalide ou a expiré.
              </v-card-text>
              <v-btn color="primary" class="mt-3" @click="redirectToLogin">
                Retour à la page de connexion
              </v-btn>
            </v-card>
          </v-container>
        </v-responsive>
      </div>
    </CenteredContainer>
</template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import logo from '@/assets/layalin_logo.png';
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const authStore = useAuthStore();
  
      const token = route.query.token;
      const newPassword = ref('');
      const confirmPassword = ref('');
      const valid = ref(false);
      const message = ref('');
      const isError = ref(false);
      const tokenValid = ref(false);
  
      const passwordRules = computed(() => [
        v => !!v || 'Le mot de passe est requis',
        v => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères'
      ]);
  
      const confirmPasswordRules = computed(() => [
        v => v === newPassword.value || 'Les mots de passe ne correspondent pas'
      ]);
  
      const resetPassword = async () => {
        if (!valid.value) return;
  
        try {
          await authStore.resetPassword(token, newPassword.value);
          message.value = 'Votre mot de passe a été réinitialisé avec succès.';
          isError.value = false;
          router.push('/login');
        } catch (error) {
          message.value = error.message;
          isError.value = true;
        }
      };
  
      const validateToken = async () => {
        try {
          await authStore.validateResetToken(token);
          tokenValid.value = true;
        } catch (error) {
          tokenValid.value = false;
        }
      };
  
      const redirectToLogin = () => {
        router.push('/login');
      };
  
      onMounted(() => {
        if (!token) {
          tokenValid.value = false;
        } else {
          validateToken();
        }
      });
  
      return {
        newPassword,
        confirmPassword,
        valid,
        message,
        logo,
        isError,
        resetPassword,
        tokenValid,
        redirectToLogin,
        passwordRules,
        confirmPasswordRules
      };
    }
  };
  </script>
  