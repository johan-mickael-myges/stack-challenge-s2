import { RouteRecordRaw } from 'vue-router';
import OrderDetails from '@/views/user/cart/OrderDetails.vue';
import OrderConfirmation from '@/views/user/cart/OrderConfirmation.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import DeliveryDetails from '@/views/user/cart/DeliveryDetails.vue';
import PaidOrdersPage from '@/views/user/Profile/PaidOrdersPage.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/order/:orderId',
        component: UserLayout,
        children: [
            {
                path: 'delivery',
                name: 'OrderDeliveryDetails',
                component: DeliveryDetails,
                meta: { requiresAuth: true }
            },
            {
                path: '',
                name: 'OrderDetails',
                component: OrderDetails,
                meta: { requiresAuth: true },
                props: (route) => ({
                    orderId: route.params.orderId,
                    totalShippingCost: route.query.totalShippingCost ? Number(route.query.totalShippingCost) : 0,
                }),
            },
            {
                path: 'order-confirmation',
                name: 'OrderConfirmation',
                component: OrderConfirmation,
                meta: { requiresAuth: true }
            },
        ],
    },
    {
        path: '/paid-orders',
        component: UserLayout,
        meta: { requireAuth: true },
        children: [
            {
                path: '',
                name: 'PaidOrders',
                component: PaidOrdersPage,
                meta: { requiresAuth: true }
            }
        ],
    }
];

export default routes;
