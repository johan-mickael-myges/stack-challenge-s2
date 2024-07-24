import { RouteRecordRaw } from 'vue-router';
import ProductList from "@/views/public/products/ProductList.vue";
import Product from "@/views/public/products/Product.vue";
import PublicLayout from "@/layouts/PublicLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/products',
        component: PublicLayout,
        children: [
            { path: '', name: 'ProductList', component: ProductList },
            { path: ':id', name: 'Product', component: Product },
        ],
    }
];

export default routes;
