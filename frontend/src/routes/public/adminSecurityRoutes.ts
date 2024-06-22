import { RouteRecordRaw } from 'vue-router';
import Login from "@/views/public/admin/Login.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login/admin',
        component: Login,
    },
];

export default routes;