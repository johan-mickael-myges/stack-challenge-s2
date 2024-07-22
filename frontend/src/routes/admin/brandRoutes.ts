import { RouteRecordRaw } from 'vue-router';
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminBrandList from "@/views/admin/brands/AdminBrandList.vue";
import AdminBrandForm from "@/views/admin/brands/AdminBrandForm.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin/brands',
        component: AdminLayout,
        children: [
            { path: '', name: 'AdminBrandList', component: AdminBrandList },
            { path: 'new', name: 'AdminBrandForm', component: AdminBrandForm },
            { path: 'edit/:id', name: 'AdminBrandEdit', component: AdminBrandForm },
        ],
        meta: {
            requiresAdmin: true,
        }
    }
];

export default routes;
