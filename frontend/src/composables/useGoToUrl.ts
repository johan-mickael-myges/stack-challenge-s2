import { useRouter } from 'vue-router';

export function useGoToUrl() {
    const router = useRouter();

    const goToByName = (name: string, params?: Record<string, any>, query?: Record<string, any>) => {
        router.push({
            name,
            params,
            query,
        });
    }

    const goToByPath = (path: string, query?: Record<string, any>) => {
        router.push({
            path,
            query,
        });
    }

    return { goToByName, goToByPath };
}