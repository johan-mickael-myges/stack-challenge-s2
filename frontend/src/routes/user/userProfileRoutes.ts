import { RouteRecordRaw } from 'vue-router';
import UserProfile from '@/views/user/UserProfile.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }, // Require authentication to access this route
  },
];

export default routes;
