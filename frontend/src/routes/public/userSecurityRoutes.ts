import { RouteRecordRaw } from 'vue-router';
import Login from "@/views/public/user/Login.vue";
import Register from '@/views/public/user/Register.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    }
];

export default routes;