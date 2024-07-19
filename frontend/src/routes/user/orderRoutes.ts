import { RouteRecordRaw } from 'vue-router';
import OrderDetails from '@/views/user/cart/OrderDetails.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/order-details/:orderId',
        component: UserLayout,
        children: [
            { path: '', name: 'OrderDetails', component: OrderDetails, meta: { requiresAuth: true } },
        ],
    }
];

export default routes;
