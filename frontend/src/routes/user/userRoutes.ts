import { RouteRecordRaw } from 'vue-router';
import Profile from '@/views/user/Profile/Profile.vue';
import UserOrders from '@/views/user/cart/OrderDetails.vue';
import UserInfo from '@/views/user/Profile/userInfo.vue';
import confirmationDelete from '@/views/user/Profile/confirmationDelete.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'orders',
        name: 'UserOrders',
        component: UserOrders,
        meta: { requiresAuth: true },
      },
      {
        path: 'info',
        name: 'UserInfo',
        component: UserInfo,
        meta: { requiresAuth: true },
      }, 
      {
        path: 'confirm-delete',
        name: 'confirmationDelete',
        component: confirmationDelete,
        meta: { requiresAuth: true },
      }
    ],
  },
];

export default routes;