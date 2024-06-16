import { RouteRecordRaw } from 'vue-router';
import AdminProductList from '@/views/admin/AdminProductList.vue';
import AdminProductForm from '@/views/admin/AdminProductForm.vue';
import AdminLayout from "@/layouts/AdminLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            { path: '/admin/products', name: 'AdminProductList', component: AdminProductList },
            { path: '/admin/products/new', name: 'AdminProductForm', component: AdminProductForm },
            { path: '/admin/products/edit/:id', name: 'AdminProductEdit', component: AdminProductForm },
        ],
    }
];

export default routes;
