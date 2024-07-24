import { defineStore } from 'pinia';
import { reactive, ref, computed } from 'vue';
import { ExpressError, LoginData, RegisterData } from '@/types';
import apiClient from "@/config/axios.ts";
import { useRouter } from 'vue-router';
import {z} from 'zod';

const ApiUserSchema = z.object({
    userId: z.number(),
    roles: z.array(z.string())
});

export type ApiUser = z.infer<typeof ApiUserSchema>;

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false);
    const hasError = ref(false);
    const errors = ref<Record<string, ExpressError[]>>({});
    const router = useRouter();
    const isAuthenticated = ref(false);
    const user = ref<ApiUser | null>(null);
    const httpCode = ref(200);

    const resetState = () => {
        loading.value = false;
        hasError.value = false;
        errors.value = {};
    }

    const deleteUser = async () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                await apiClient.post('/auth/delete');
            } catch {
                console.log('erreur1');
            }
        }
    }

    const register = async (data: RegisterData) => {
        resetState();
        try {
            await apiClient.post('/auth/register', data);
            window.location.href = '/login';
            alert('Votre compte a été créé avec succès.');
        } catch (err: any) {
            hasError.value = true;
            if (err.response && err.response.data) {
                const validationErrors: ExpressError[] = err.response.data;
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

    const infoUser = async () => {
        try {
            const response = await apiClient.get('/auth/infoUser');
            user.value = response.data; // Stocke les données utilisateur dans le store
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    const login = async (data: LoginData) => {
        resetState();
        try {
            await apiClient.post('/auth/login', data);
        } catch (err: any) {
            hasError.value = true;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const verifyAuth = async (admin = false) => {
        try {
            const response = await apiClient.get('/auth/check', {
                params: {
                    admin
                }
            });
            user.value = ApiUserSchema.parse(response.data);
            isAuthenticated.value = true;
            httpCode.value = response.status;
        } catch (err: any) {
            user.value = null;
            isAuthenticated.value = false;
            httpCode.value = err.response.status;
        }
    };

    const checkAdmin = async() => {
        try {
            const response = await apiClient.get('/auth/check-admin');
            isAuthenticated.value = true;
            httpCode.value = response.status;
        } catch (err: any) {
            user.value = null;
            isAuthenticated.value = false;
            httpCode.value = err.response.status;
        }
    };

    const logout = async () => {
        resetState();
        try {
            await apiClient.post('/auth/logout');
            isAuthenticated.value = false;
            window.location.href = '/login';
        } catch (err: any) {
            hasError.value = true;
            throw err;
        } finally {
            loading.value = false;
            await router.push({
                name: 'Login',
            })
        }
    }

    const confirmDeletion = async (password: string) => {
        try {
            await apiClient.post('auth/delete', {
                password
            });
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string, confirmNewPassword: string) => {
        try {
            await apiClient.post('auth/change-password', {
                currentPassword,
                newPassword,
                confirmNewPassword
            });
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const sendEmailResetPassword = async (email: string): Promise<string> => {
        try {
            const response = await apiClient.post('/auth/EmailResetPassword', { email });
            
            if (response.status === 200) {
                return 'La demande de réinitialisation de mot de passe a été envoyée avec succès.';
            } else {
                throw new Error('Une erreur est survenue lors de l\'envoi de la demande de réinitialisation de mot de passe.');
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                throw new Error(err.response.data.message);
            } else {
                throw new Error('Cette adresse e-mail n\'existe pas.');
            }
        }
    };   
    
    const resetPassword = async (token: string, newPassword: string) => {
        try {
            await apiClient.post('/auth/resetPassword', {
              token,
              newPassword
            });
            window.location.href = '/login';
            alert('Le mot de passe a été réinitialisé avec succès.');
          } catch (error) {
            throw error;
          }
    }

    const validateResetToken = async (token: string) => {
        try {
          const response = await apiClient.post('/auth/validateResetToken', {
            token
          });
          return response.data.valid;
        } catch (error) {
          throw error;
        }
    };

    return {
        loading,
        errors,
        hasError,
        register,
        login,
        logout,
        user,
        verifyAuth,
        changePassword,
        resetPassword,
        validateResetToken,
        isAuthenticated,
        confirmDeletion,
        sendEmailResetPassword,
        infoUser,
        checkAdmin,
    };
});
