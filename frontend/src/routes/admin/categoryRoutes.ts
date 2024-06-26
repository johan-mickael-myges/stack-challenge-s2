import { RouteRecordRaw } from 'vue-router';
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminCategoryList from "@/views/admin/categories/AdminCategoryList.vue";
import AdminCategoryForm from "@/views/admin/categories/AdminCategoryForm.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin/categories',
        component: AdminLayout,
        children: [
            { path: '', name: 'AdminCategoryList', component: AdminCategoryList },
            { path: 'new', name: 'AdminCategoryForm', component: AdminCategoryForm },
            { path: 'edit/:id', name: 'AdminCategoryEdit', component: AdminCategoryForm },
        ],
        meta: {
            requiresAuth: true,
        }
    }
];

export default routes;
