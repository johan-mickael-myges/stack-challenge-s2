import { createRouter, createWebHistory } from 'vue-router';
import UserProfile from '@/views/user/UserProfile.vue'; // Import UserProfile

const routes = [
  { path: '/user-profile', name: 'UserProfile', component: UserProfile }, // Add this route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
