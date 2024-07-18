import { RouteRecordRaw } from 'vue-router';
import UserProfile from '@/views/user/UserProfile.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/userProfile',
        component: UserProfile,
        children: [
            { path: '/user-profile', name: 'UserProfile', component: UserProfile },
        ],
    }
];

export default routes;
