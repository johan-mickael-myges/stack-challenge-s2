import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';

const routes: Array<RouteRecordRaw> = [
    ...adminProductRoutes,
    ...adminCategoryRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
