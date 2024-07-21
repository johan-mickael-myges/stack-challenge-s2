import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

import errorRoutes from "@/routes/error/errorRoutes.ts";
import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import homeRoutes from "@/routes/public/homeRoutes.ts";
import cartRoutes from "@/routes/user/cartRoutes.ts";
import userSecurityRoutes from "@/routes/public/security/userSecurityRoutes.ts";
import productRoutes from './public/products/productRoutes';
import adminSecurityRoutes from "@/routes/public/security/adminSecurityRoutes.ts";
import privacyPolicyRoutes from '@/routes/public/policy/privacyPolicyRoutes';
import orderRoutes from '@/routes/user/orderRoutes.ts';
import { useAuthStore } from "@/stores/auth.ts";

const routes: Array<RouteRecordRaw> = [
    ...adminSecurityRoutes,
    ...adminProductRoutes,
    ...adminCategoryRoutes,
    ...homeRoutes,
    ...cartRoutes,
    ...userSecurityRoutes,
    ...productRoutes,
    ...errorRoutes,
    ...privacyPolicyRoutes, 
    ...orderRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore();

    // Check if route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth || record.meta.requiresAdmin)) {
        if (!authStore.user.userId) {
            try {
                await authStore.verifyAuth();
            } catch (error) {
                return next({ path: '/login', query: { redirect: to.fullPath } });
            }
        }

        // Check if route requires admin role
        if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.user.roles.includes('ROLE_ADMIN')) {
            return next({ path: '/unauthorized' });
        }
    }

    next();
});

export default router;
