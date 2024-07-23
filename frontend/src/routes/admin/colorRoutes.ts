import { RouteRecordRaw } from 'vue-router';
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminColorList from "@/views/admin/colors/AdminColorList.vue";
import AdminColorForm from "@/views/admin/colors/AdminColorForm.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin/colors',
        component: AdminLayout,
        children: [
            { path: '', name: 'AdminColorList', component: AdminColorList },
            { path: 'new', name: 'AdminColorForm', component: AdminColorForm },
            { path: 'edit/:id', name: 'AdminColorEdit', component: AdminColorForm },
        ],
        meta: {
            requiresAdmin: true,
        }
    }
];

export default routes;
