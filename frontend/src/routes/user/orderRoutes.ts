import { RouteRecordRaw } from 'vue-router';

const orderRoutes: Array<RouteRecordRaw> = [
  {
    path: '/order-details/:orderId',
    name: 'OrderDetails',
    component: () => import('@/views/user/cart/OrderDetails.vue'),
    meta: { requiresAuth: true }
  }
];

export default orderRoutes;
