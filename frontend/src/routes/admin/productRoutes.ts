import { RouteRecordRaw } from 'vue-router';
import AdminProductList from '@/views/admin/AdminProductList.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/admin/products', name: 'AdminProductList', component: AdminProductList },
];

export default routes;
