import {createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import userSecurityRoutes from "@/routes/public/userSecurityRoutes.ts";
import userProductRoutes from './user/productRoutes';
import PageNotFound from "@/components/Error/PageNotFound.vue";
import adminSecurityRoutes from "@/routes/public/adminSecurityRoutes.ts";

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

export default router;
