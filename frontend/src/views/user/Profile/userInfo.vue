<template>
    <v-container class="user-info-container" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="user-card" outlined>
            <v-card-title class="user-card-title">
              <v-icon class="user-icon">mdi-account-circle</v-icon>
              <span>Infos Utilisateur</span>
            </v-card-title>
            <v-card-subtitle v-if="user">
              <v-row>
                <v-col cols="12">
                  <p><strong>Nom:</strong> {{ user.lastname }}</p>
                </v-col>
                <v-col cols="12">
                  <p><strong>Prénom:</strong> {{ user.firstname }}</p>
                </v-col>
                <v-col cols="12">
                  <p><strong>Email:</strong> {{ user.email }}</p>
                </v-col>
                <v-col cols="12">
                  <p><strong>Numéro:</strong> {{ user.number }}</p>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-card-subtitle v-else>
              <v-alert type="info">Chargement...</v-alert>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn @click="initiateAccountDeletion" color="red">Supprimer Mon Compte</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  const router = useRouter();

    
  const initiateAccountDeletion = () => {
  if (authStore.isAuthenticated) {
    router.push({ path: '/profile/confirm-delete' }); // Par défaut, affichez les commandes
  } else {
    console.log('erreur de redirection');
    }
};

//   const initiateAccountDeletion = async () => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
//       try {
//         console.log('en couuurs');
//         const response = await axios.post('http://localhost:8000/auth/delete', {
//           userId: user.value.id,
//           email: user.value.email
//         });
//         alert(response.data);
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error('Erreur lors de la demande de suppression:', {
//             message: error.message,
//             response: error.response?.data,
//             status: error.response?.status
//           });
//         } else {
//           console.error('Erreur inconnue lors de la demande de suppression:', error);
//         }
//       }
//     }
//   };
  
  
    
  </script>
  
  
  <style scoped>
  strong {
    color: black;
  }
  
  .user-info-container {
    margin-top: 20px;
  }
  
  .user-card {
    padding: 16px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
  }
  
  .user-card-title {
    background-color: #f5f5f5;
    padding: 16px;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .user-icon {
    margin-right: 8px;
    font-size: 24px;
  }
  </style>