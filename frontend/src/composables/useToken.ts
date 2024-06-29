import { ref, computed } from 'vue';

export function useToken() {
    const token = ref(localStorage.getItem('auth_token'));

    const decodedToken = computed(() => {
        if (token.value) {
            const [, payload] = token.value.split('.');
            return JSON.parse(atob(payload));
        }
        return null;
    });

    const isLoggedIn = computed(() => !!token.value);

    const setToken = async (newToken: string|null) => {
        token.value = newToken;
        if (newToken) {
            localStorage.setItem('auth_token', newToken);
        } else {
            localStorage.removeItem('auth_token');
        }
    };

    return {
        token,
        decodedToken,
        isLoggedIn,
        setToken,
    };
}
