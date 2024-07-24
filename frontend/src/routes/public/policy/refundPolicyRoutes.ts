import { RouteRecordRaw } from 'vue-router';
import RefundPolicy from '@/views/public/user/RefundPolicy.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/refund-policy',
        component: UserLayout,
        children: [
            { path: '', name: 'RefundPolicy', component: RefundPolicy },
        ],
    }
];

export default routes;
