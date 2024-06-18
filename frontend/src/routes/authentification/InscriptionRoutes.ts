import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Inscription from '@/views/authentification/Inscription.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/inscription',
        name: 'Inscription',
        component: Inscription,
        children: [
            { path: '', name: 'Inscription', component: Inscription },
        ]
    }
];


export default routes;
