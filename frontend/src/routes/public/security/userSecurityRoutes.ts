import { RouteRecordRaw } from 'vue-router';
import Login from "@/views/public/user/Login.vue";
import Register from '@/views/public/user/Register.vue';
import EmailResetPassword from '@/views/public/user/EmailResetPassword.vue';
import ResetPassword from '@/views/public/user/ResetPassword.vue';

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
    },
    {
        name: 'EmailResetPassword',
        path: '/EmailResetPassword',
        component: EmailResetPassword,
        meta: { requiresAuth: true }
    },
    {
        name: 'resetPassword',
        path: '/resetPassword',
        component: ResetPassword,
        meta: { requiresAuth: true }
    }
];

export default routes;