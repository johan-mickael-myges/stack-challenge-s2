import { RouteRecordRaw } from 'vue-router';
import Cart from '@/views/user/cart/Cart.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/carts',
        component: UserLayout,
        children: [
            { path: '', name: 'UserCart', component: Cart },
        ],
        meta: { requiresAuth: true },
    }
];

export default routes;
