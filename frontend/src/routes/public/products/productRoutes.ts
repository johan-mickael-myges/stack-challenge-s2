import { RouteRecordRaw } from 'vue-router';
import ProductList from "@/views/public/products/ProductList.vue";
import Product from "@/views/public/products/Product.vue";
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/products',
        component: UserLayout,
        children: [
            { path: '', name: 'ProductList', component: ProductList },
            { path: ':id', name: 'Product', component: Product },
        ],
    }
];

export default routes;
