import { RouteRecordRaw } from 'vue-router';
import UserProductList from '@/views/user/home/ProductList.vue';
import UserProduct from '@/views/user/home/Product.vue';
import UserCart from '@/views/user/cart/Cart.vue';
import UserLayout from '@/layouts/UserLayout.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: UserLayout,
        children: [
            { path: '', name: 'UserProductList', component: UserProductList },
            { path: 'product/:id', name: 'UserProduct', component: UserProduct },
            { path: 'cart', name: 'UserCart', component: UserCart }
        ],
    }
];

export default routes;
