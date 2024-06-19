import { RouteRecordRaw } from 'vue-router';
import UserProductList from '@/views/user/home/ProductList.vue';
import UserProduct from '@/views/user/home/Product.vue';
import UserLayout from '@/layouts/UserLayout.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: UserLayout,
        children: [
            { path: '', name: 'UserProductList', component: UserProductList },
            { path: 'product/:id', name: 'UserProduct', component: UserProduct },
        ],
    }
];

export default routes;
