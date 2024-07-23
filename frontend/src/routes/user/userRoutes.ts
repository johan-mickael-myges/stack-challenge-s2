import { RouteRecordRaw } from 'vue-router';
import Profile from '@/views/user/Profile/Profile.vue';
import UserOrders from '@/views/user/cart/OrderDetails.vue';
import UserInfo from '@/views/user/Profile/userInfo.vue';
import confirmationDelete from '@/views/user/Profile/confirmationDelete.vue';
import modifPassword from '@/views/user/Profile/passwordModif.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    component: UserLayout,
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
      },
      {
        path: 'modif-password',
        name: 'modifPassword',
        component: modifPassword,
        meta: { requiresAuth: true },
      }
    ],
  },
];

export default routes;