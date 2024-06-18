import { RouteRecordRaw } from 'vue-router';
import Login from "@/views/public/user/Login.vue";
import Register from '@/views/public/user/Register.vue';

const routes: Array<RouteRecordRaw> = [
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
    {
        name: 'register',
        path: '/register',
        component: Register,
    }
];

export default routes;