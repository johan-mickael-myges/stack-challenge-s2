import {RouteRecordRaw} from 'vue-router';
import UserOrders from '@/views/user/cart/OrderDetails.vue';
import UserInfo from '@/views/user/Profile/userInfo.vue';
import confirmationDelete from '@/views/user/Profile/confirmationDelete.vue';
import modifPassword from '@/views/user/Profile/passwordModif.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import UserSettingLayout from "@/views/user/Profile/Settings/UserSettingLayout.vue";
import UserAlerts from "@/views/user/Profile/Settings/UserAlerts.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/profile',
        component: UserLayout,
        meta: {requiresAuth: true},
        children: [
            {
                path: 'settings',
                name: 'UserSettings',
                component: UserSettingLayout,
                meta: {requiresAuth: true},
                children: [
                    {
                        path: 'alerts',
                        name: 'UserAlerts',
                        component: UserAlerts,
                        meta: {requiresAuth: true},
                    },
                    {
                        path: 'info',
                        name: 'UserInfo',
                        component: UserInfo,
                        meta: {requiresAuth: true},
                    },
                    {
                        path: 'confirm-delete',
                        name: 'confirmationDelete',
                        component: confirmationDelete,
                        meta: {requiresAuth: true},
                    },
                    {
                        path: 'modif-password',
                        name: 'ChangePassword',
                        component: modifPassword,
                        meta: {requiresAuth: true},
                    },
                ]
            },
            {
                path: 'orders',
                name: 'UserOrders',
                component: UserOrders,
                meta: {requiresAuth: true},
            },
        ],
    },
];

export default routes;