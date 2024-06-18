import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import userProductRoutes from './user/productRoutes';
import InscriptionRoutes from './authentification/InscriptionRoutes';

const routes: Array<RouteRecordRaw> = [
    ...adminProductRoutes,
    ...adminCategoryRoutes,
    ...userProductRoutes,
    ...InscriptionRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
