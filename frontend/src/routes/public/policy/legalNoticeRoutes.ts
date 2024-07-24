import { RouteRecordRaw } from 'vue-router';
import LegalNotice from '@/views/public/user/LegalNotice.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/legal-notice',
        component: UserLayout,
        children: [
            { path: '', name: 'LegalNotice', component: LegalNotice },
        ],
    }
];

export default routes;
