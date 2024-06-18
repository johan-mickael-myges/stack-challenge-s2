import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import userProductRoutes from './user/productRoutes';
import PageNotFound from "@/components/Pages/PageNotFound.vue";

const routes: Array<RouteRecordRaw> = [
    ...adminProductRoutes,
    ...adminCategoryRoutes,
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
