import { useRouter } from 'vue-router';

export function useGoToUrl() {
    const router = useRouter();
    const login = () => {
        router.push({
            name: 'login',
        });
    }

    return { login };
};