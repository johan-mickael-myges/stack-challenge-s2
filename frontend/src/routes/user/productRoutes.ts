import { RouteRecordRaw } from 'vue-router';
import UserProductList from '@/views/user/home/ProductList.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import ShoppingCart from '@/views/user/ShoppingCart.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: UserLayout,
        children: [
            { path: '', name: 'UserProductList', component: UserProductList },
        ],
    },
    {
        path: '/cart',
        name: 'ShoppingCart',
        component: ShoppingCart,
    }
];

export default routes;
