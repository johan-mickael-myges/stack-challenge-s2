import { RouteRecordRaw } from 'vue-router';
import OrderDetails from '@/views/user/cart/OrderDetails.vue';
import OrderConfirmation from '@/views/user/cart/OrderConfirmation.vue';
import UserLayout from '@/layouts/UserLayout.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/order-details/:orderId',
        component: UserLayout,
        children: [
            { path: '', name: 'OrderDetails', component: OrderDetails, meta: { requiresAuth: true } },
            { path: 'order-confirmation', name: 'OrderConfirmation', component: OrderConfirmation },
        ],
    }
];

export default routes;
