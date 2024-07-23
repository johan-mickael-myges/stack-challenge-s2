import { RouteRecordRaw } from 'vue-router';
import OrderDetails from '@/views/user/cart/OrderDetails.vue';
import OrderConfirmation from '@/views/user/cart/OrderConfirmation.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import DeliveryDetails from "@/views/user/cart/DeliveryDetails.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/order/:orderId',
        component: UserLayout,
        children: [
            { path: 'delivery', name: 'OrderDeliveryDetails', component: DeliveryDetails },
            { path: '', name: 'OrderDetails', component: OrderDetails, meta: { requiresAuth: true } },
            { path: 'order-confirmation', name: 'OrderConfirmation', component: OrderConfirmation },
        ],
    }
];

export default routes;
