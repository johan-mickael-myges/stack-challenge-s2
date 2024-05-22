import { createMemoryHistory, createRouter } from 'vue-router';

import productRouter from './modules/product';

const routes = [
  ...productRouter,
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
