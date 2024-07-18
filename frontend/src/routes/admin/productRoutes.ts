import { RouteRecordRaw } from 'vue-router';
import AdminProductList from '@/views/admin/products/AdminProductList.vue';
import AdminProductForm from '@/views/admin/products/AdminProductForm.vue';
import AdminProductStockForm from '@/views/admin/products/AdminProductStockForm.vue';
import AdminLayout from "@/layouts/AdminLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin/products',
        component: AdminLayout,
        children: [
            { path: '', name: 'AdminProductList', component: AdminProductList },
            { path: 'new', name: 'AdminProductForm', component: AdminProductForm },
            { path: 'edit/:id', name: 'AdminProductEdit', component: AdminProductForm },
            { path: ':id/stock', name: 'AdminProductStockForm', component: AdminProductStockForm }
        ],
        meta: {
            requiresAdmin: true,
        }
    }
];

export default routes;
