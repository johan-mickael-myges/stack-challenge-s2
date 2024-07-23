import { defineStore } from 'pinia';
import {reactive, ref, computed} from 'vue';
import {ExpressError, LoginData, RegisterData} from '@/types';
import apiClient from "@/config/axios.ts";
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false);
    const hasError = ref(false);
    const errors = ref<Record<string, ExpressError[]>>({});
    const router = useRouter();
    let user = reactive<{ [key: string]: any }>({});

    const resetState = () => {
        loading.value = false;
        hasError.value = false;
        errors.value = {};
    }

    const saveUserToLocalStorage = () => {
        localStorage.setItem('user', JSON.stringify(user));
    };

    const loadUserFromLocalStorage = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            Object.assign(user, JSON.parse(userData));
        }
    };

    const deleteUser = async () => {
        const userData = localStorage.getItem('user');
        if (userData){
            try {
                await apiClient.post('/auth/delete');
            }
            catch{
                console.log('erreur1');
            }
        };
        
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

    const login = async (data: LoginData) => {
        resetState();
        try {
            const response = await apiClient.post('/auth/login', data);
            Object.assign(user, response.data.user);
        } catch (err: any) {
            hasError.value = true;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const verifyAuth = async () => {
        try {
            const response = await apiClient.get('/auth/check');
            Object.assign(user, response.data);
        } catch (err: any) {
            Object.keys(user).forEach(key => delete user[key]);
            throw err;
        }
    };

    const logout = async () => {
        resetState();
        try {
            Object.keys(user).forEach(key => delete user[key]);
            await apiClient.post('/auth/logout');
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
      

       
      
    

    const isAuthenticated = computed(() => !!Object.keys(user).length);

    loadUserFromLocalStorage();

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
        isAuthenticated,
        confirmDeletion,
    };
});
