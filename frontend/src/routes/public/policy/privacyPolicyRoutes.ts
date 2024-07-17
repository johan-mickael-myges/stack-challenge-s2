import { RouteRecordRaw } from 'vue-router';
import PrivacyPolicy from '@/views/public/user/PrivacyPolicy.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/privacy-policy',
        component: UserLayout,
        children: [
            { path: '', name: 'PrivacyPolicy', component: PrivacyPolicy },
        ],
    }
];

export default routes;
