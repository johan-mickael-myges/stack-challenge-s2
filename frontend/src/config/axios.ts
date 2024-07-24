import axios from 'axios';
import { API_BASE_URL } from './api';
import router from '@/routes';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 403) {
                await router.push({ name: 'Forbidden' });
            }
        }

        return Promise.reject(error);
    }
);


export default apiClient;
