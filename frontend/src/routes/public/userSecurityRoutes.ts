import { RouteRecordRaw } from 'vue-router';
import Login from "@/views/public/user/Login.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/user/login',
        component: Login,
    }
];

export default routes;