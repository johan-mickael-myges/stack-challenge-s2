import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect() {
            return '/products';
        },
    }
];

export default routes;
