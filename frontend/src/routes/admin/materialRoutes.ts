import { RouteRecordRaw } from 'vue-router';
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminMaterialList from "@/views/admin/materials/AdminMaterialList.vue";
import AdminMaterialForm from "@/views/admin/materials/AdminMaterialForm.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin/materials',
        component: AdminLayout,
        children: [
            { path: '', name: 'AdminMaterialList', component: AdminMaterialList },
            { path: 'new', name: 'AdminMaterialForm', component: AdminMaterialForm },
            { path: 'edit/:id', name: 'AdminMaterialEdit', component: AdminMaterialForm },
        ],
        meta: {
            requiresAdmin: true,
        }
    }
];

export default routes;
