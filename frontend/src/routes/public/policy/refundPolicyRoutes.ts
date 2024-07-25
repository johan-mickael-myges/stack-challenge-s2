import { RouteRecordRaw } from 'vue-router';
import RefundPolicy from '@/views/public/user/RefundPolicy.vue';
import PublicLayout from "@/layouts/PublicLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/refund-policy',
        component: PublicLayout,
        children: [
            { path: '', name: 'RefundPolicy', component: RefundPolicy },
        ],
    }
];

export default routes;
