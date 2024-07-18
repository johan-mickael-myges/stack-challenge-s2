import { RouteRecordRaw } from 'vue-router';
import Profile from '@/views/user/Profile.vue';
import UserOrders from '@/views/user/userOrders.vue';
import UserInfo from '@/views/user/userInfo.vue';

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
    ],
  },
];

export default routes;
