import { createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import adminProductRoutes from './admin/productRoutes';

const routes: Array<RouteRecordRaw> = [
  ...adminProductRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
