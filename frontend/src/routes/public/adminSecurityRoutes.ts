import { RouteRecordRaw } from 'vue-router';
import Login from "@/views/public/admin/Login.vue";
import Register from '@/views/public/admin/Register.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login/admin',
        component: Login,
    },
    {
        path: '/register/admin',
        component: Register,
    }
];

export default routes;