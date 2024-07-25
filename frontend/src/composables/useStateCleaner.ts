import {useAuthStore} from "@/stores/auth.ts";
import {useAddressStore} from "@/stores/address.ts";
import {useBrandStore} from "@/stores/brands.ts";
import {useCartStore} from "@/stores/cart.ts";
import {useCategoryStore} from "@/stores/categories.ts";
import {useColorStore} from "@/stores/colors.ts";
import {useDeliveryStore} from "@/stores/delivery.ts";
import {useMaterialStore} from "@/stores/materials.ts";
import {useOrderStore} from "@/stores/order.ts";
import {useProductFacetsStore} from "@/stores/productFacets.ts";
import {useProductStore} from "@/stores/products.ts";
import {useShippingMethodStore} from "@/stores/shippingMethods.ts";

export function cleanAllStates() {
    (useAuthStore()).clearState();
    (useAddressStore()).clearState();
    (useBrandStore()).clearState();
    (useCartStore()).clearState();
    (useCategoryStore()).clearState();
    (useColorStore()).clearState();
    (useDeliveryStore()).clearState();
    (useMaterialStore()).clearState();
    (useOrderStore()).clearState();
    (useProductFacetsStore()).clearState();
    (useProductStore()).clearState();
    useShippingMethodStore().clearState();
}