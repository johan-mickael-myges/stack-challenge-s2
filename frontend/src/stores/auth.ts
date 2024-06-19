import { defineStore } from 'pinia';
import { ref } from 'vue';
import {ExpressError, RegisterData} from '@/types';
import apiClient from "@/config/axios.ts";

export const useAuthStore = defineStore('auth', () => {
    const loading = ref(false);
    const errors = ref<Record<string, ExpressError[]>>({});

    const register = async (data: RegisterData) => {
        loading.value = true;
        errors.value = {};
        try {
            await apiClient.post('/auth/register', data);
        } catch (err: any) {
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

    return {
        loading,
        errors,
        register,
    };
});
