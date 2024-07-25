import { RouteRecordRaw } from 'vue-router';
import PrivacyPolicy from '@/views/public/user/PrivacyPolicy.vue';
import PublicLayout from "@/layouts/PublicLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/privacy-policy',
        component: PublicLayout,
        children: [
            { path: '', name: 'PrivacyPolicy', component: PrivacyPolicy },
        ],
    }
];

export default routes;
