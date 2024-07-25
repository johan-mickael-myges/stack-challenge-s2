import { RouteRecordRaw } from 'vue-router';
import ErrorLayout from '@/layouts/ErrorLayout.vue';
import Unauthorized from "@/components/Error/Unauthorized.vue";
import PageNotFound from "@/components/Error/PageNotFound.vue";
import Forbidden from "@/components/Error/Forbidden.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ErrorLayout,
        children: [
            { path: 'unauthorized', name: 'Unauthorized', component: Unauthorized },
            { path: 'forbidden', name: 'Forbidden', component: Forbidden },
            { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: PageNotFound}
        ],
    }
];

export default routes;
