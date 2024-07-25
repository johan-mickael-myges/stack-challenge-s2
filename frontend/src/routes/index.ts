import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

import errorRoutes from "@/routes/error/errorRoutes.ts";
import adminProductRoutes from './admin/productRoutes';
import adminCategoryRoutes from './admin/categoryRoutes';
import adminBrandRoutes from './admin/brandRoutes';
import adminColorRoutes from './admin/colorRoutes';
import adminMaterialRoutes from './admin/materialRoutes';
import homeRoutes from "@/routes/public/homeRoutes.ts";
import cartRoutes from "@/routes/user/cartRoutes.ts";
import userSecurityRoutes from "@/routes/public/security/userSecurityRoutes.ts";
import productRoutes from './public/products/productRoutes';
import adminSecurityRoutes from "@/routes/public/security/adminSecurityRoutes.ts";
import privacyPolicyRoutes from '@/routes/public/policy/privacyPolicyRoutes';
import refundPolicyRoutes from '@/routes/public/policy/refundPolicyRoutes';
import legalNoticeRoutes from '@/routes/public/policy/legalNoticeRoutes';
import orderRoutes from '@/routes/user/orderRoutes.ts';
import { useAuthStore } from "@/stores/auth.ts";
import UserProfileRoutes from '@/routes/user/userRoutes';
import {computed} from "vue";
import {record} from "zod";

const routes: Array<RouteRecordRaw> = [
    ...adminSecurityRoutes,
    ...adminProductRoutes,
    ...adminBrandRoutes,
    ...adminCategoryRoutes,
    ...adminColorRoutes,
    ...adminMaterialRoutes,
    ...homeRoutes,
    ...cartRoutes,
    ...userSecurityRoutes,
    ...productRoutes,
    ...errorRoutes,
    ...privacyPolicyRoutes, 
    ...refundPolicyRoutes, 
    ...legalNoticeRoutes, 
    ...orderRoutes,
    ...UserProfileRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
