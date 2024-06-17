import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import userProductRoutes from './user/productRoutes';

const routes: Array<RouteRecordRaw> = [
    ...adminProductRoutes,
    ...adminCategoryRoutes,
    ...userProductRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
