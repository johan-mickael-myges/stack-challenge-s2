import { RouteRecordRaw } from 'vue-router';
import LegalNotice from '@/views/public/user/LegalNotice.vue';
import PublicLayout from "@/layouts/PublicLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/legal-notice',
        component: PublicLayout,
        children: [
            { path: '', name: 'LegalNotice', component: LegalNotice },
        ],
    }
];

export default routes;
