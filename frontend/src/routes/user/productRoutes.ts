import { RouteRecordRaw } from 'vue-router';
import UserProductList from '@/views/user/home/ProductList.vue';
import UserLayout from '@/layouts/UserLayout.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: UserLayout,
        children: [
            { path: '', name: 'UserProductList', component: UserProductList },
        ],
    }
];

export default routes;
