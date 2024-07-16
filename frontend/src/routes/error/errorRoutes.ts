import { RouteRecordRaw } from 'vue-router';
import ErrorLayout from '@/layouts/ErrorLayout.vue';
import Unauthorized from "@/components/Error/Unauthorized.vue";
import PageNotFound from "@/components/Error/PageNotFound.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ErrorLayout,
        children: [
            { path: 'unauthorized', name: 'Unauthorized', component: Unauthorized },
            { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: PageNotFound}
        ],
    }
];

export default routes;
