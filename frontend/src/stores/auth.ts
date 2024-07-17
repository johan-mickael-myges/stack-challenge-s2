// /src/stores/auth.ts

import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { ExpressError, LoginData, RegisterData } from '@/types';
import apiClient from "@/config/axios.ts";
import { useRouter } from 'vue-router';
import { User } from '@/types'; // Assurez-vous d'importer l'interface User depuis le fichier types/index.ts

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false);
    const hasError = ref(false);
    const errors = ref<Record<string, ExpressError[]>>({});
    const isAuthenticated = ref(false);
    const user: Ref<User | null> = ref(null); // Utilisation de Ref pour user

    const router = useRouter();

    // Fonction de réinitialisation de l'état
    const resetState = () => {
        loading.value = false;
        hasError.value = false;
        errors.value = {};
    }

    // Fonction d'inscription
    const register = async (data: RegisterData) => {
        resetState();
        try {
            await apiClient.post('/auth/register', data);
        } catch (err: any) {
            hasError.value = true;
            if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
                const validationErrors: ExpressError[] = err.response.data.errors;
                validationErrors.forEach((error: ExpressError) => {
                    if (!errors.value[error.path]) {
                        errors.value[error.path] = [];
                    }
                    errors.value[error.path].push(error);
                });
            }
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Fonction de connexion
    const login = async (data: LoginData) => {
        resetState();
        try {
            const response = await apiClient.post('/auth/login', data);
            user.value = response.data.user;  // Sauvegarde des données utilisateur
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Sauvegarder dans le localStorage
            isAuthenticated.value = true;    // Définition de isAuthenticated à true
        } catch (err: any) {
            hasError.value = true;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Fonction de déconnexion
    const logout = async () => {
        resetState();
        try {
            await apiClient.post('/auth/logout');
            isAuthenticated.value = false; // Définition de isAuthenticated à false
            user.value = null; // Effacer les données utilisateur
            localStorage.removeItem('user'); // Supprimer du localStorage
            // Redirection vers la page de connexion
            await router.push({
                name: 'Login',
            });
        } catch (err: any) {
            hasError.value = true;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // Fonction pour récupérer les données utilisateur depuis le localStorage
    const loadUserFromStorage = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
            isAuthenticated.value = true;
        }
    }

    return {
        loading,
        errors,
        hasError,
        isAuthenticated,
        user, // Retourne la référence de user
        register,
        login,
        logout,
        loadUserFromStorage, // Expose la nouvelle fonction
    };
});
