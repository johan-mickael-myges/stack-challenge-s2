import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import userSecurityRoutes from "@/routes/public/userSecurityRoutes.ts";
import userProductRoutes from './user/productRoutes';
import PageNotFound from "@/components/Error/PageNotFound.vue";
import adminSecurityRoutes from "@/routes/public/adminSecurityRoutes.ts";
import {useAuthStore} from "@/stores/auth.ts";

const routes: Array<RouteRecordRaw> = [
    ...adminSecurityRoutes,
    ...adminProductRoutes,
    ...adminCategoryRoutes,
    ...userSecurityRoutes,
    ...userProductRoutes,
    {
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        component: PageNotFound,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard to protect routes
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore();

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.isLoggedIn) {
            next({
                path: '/login',
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (authStore.isLoggedIn) {
            next({ path: '/dashboard' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
