import { defineStore } from 'pinia';
import {reactive, ref} from 'vue';
import {ExpressError, LoginData, RegisterData} from '@/types';
import apiClient from "@/config/axios.ts";
import {useToken} from "@/composables/useToken.ts";

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false);
    const hasError = ref(false);
    const errors = ref<Record<string, ExpressError[]>>({});
    const user = reactive<{ [key: string]: any }>({});
    const { token, decodedToken, isLoggedIn, setToken } = useToken();

    const resetState = () => {
        loading.value = false;
        hasError.value = false;
        errors.value = {};
    }

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

    const login = async (data: LoginData) => {
        resetState();
        try {
            const response = await apiClient.post('/auth/login', data);
            await setToken(response.data.token);
            Object.assign(user, response.data.user);
        } catch (err: any) {
            hasError.value = true;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    const logout = async () => {
        await setToken(null);
        Object.keys(user).forEach(key => delete user[key]);
    }

    return {
        loading,
        errors,
        hasError,
        register,
        login,
        logout,
        user,
        token,
        decodedToken,
        isLoggedIn,
    };
});
