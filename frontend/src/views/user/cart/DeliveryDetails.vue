<template>
  <div class="w-full flex justify-center">
    <div class="w-full md:w-2/3 lg:w-1/2">
      <h2 class="text-2xl font-bold mb-4">Vos options de livraisons</h2>
      <div v-if="shippingMethods.length === 0">
        <p>Aucun mode de livraison disponible</p>
      </div>
      <div v-else>
        <ShippingOptionsForm :items="shippingMethods" @update-values="onShippingOptionChange"/>
      </div>

      <div class="mb-4">
        <DeliveryInformationsForm :errors="deliveryInformationsErrors" @update-values="onDeliveryInformationsChange"/>
      </div>

      <v-btn
          class="mx-auto my-4 px-4 py-2 bg-blue-500 text-white"
          color="primary"
          block
          @click="createDelivery"
      >
        Valider et procéder au paiement
      </v-btn>

      <v-alert v-if="errors" :text="errors" color="red" variant="tonal" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { ShippingMethod, useShippingMethodStore } from "@/stores/shippingMethods.ts";
import ShippingOptionsForm from "@/components/Form/ShippingOptionsForm.vue";
import DeliveryInformationsForm from "@/components/Form/DeliveryInformationsForm.vue";
import { DeliveryInformation, useDeliveryStore } from "@/stores/delivery.ts";
import { useRoute, useRouter } from "vue-router";
import { ZodError } from "zod";
import { useOrderStore } from "@/stores/order.ts";

export default defineComponent({
  name: 'DeliveryDetails',
  components: { DeliveryInformationsForm, ShippingOptionsForm },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const shippingMethodsStore = useShippingMethodStore();
    const deliveryStore = useDeliveryStore();
    const orderStore = useOrderStore();

    const orderId = route.params.orderId as string;
    const shippingMethodId = ref(0);
    const errors = ref('');

    const deliveryInformation = ref<DeliveryInformation>({
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      billingFirstName: '',
      billingLastName: '',
      billingAddress: '',
      billingPhoneNumber: '',
    });

    onMounted(async () => {
      await shippingMethodsStore.fetchShippingMethods();
      await orderStore.fetchDelivery(Number(orderId));
    });

    const shippingMethods = computed(() => shippingMethodsStore.shippingMethods);

    const onShippingOptionChange = (shippingMethod: ShippingMethod) => {
      shippingMethodId.value = shippingMethod.id;
    };

    const onDeliveryInformationsChange = (values: DeliveryInformation) => {
      deliveryInformation.value = values;
    };

    const createDelivery = async () => {
      try {
        await deliveryStore.createDelivery({
          orderId,
          shippingMethodId: shippingMethodId.value,
          firstName: deliveryInformation.value.firstName,
          lastName: deliveryInformation.value.lastName,
          address: deliveryInformation.value.address,
          phoneNumber: deliveryInformation.value.phoneNumber,
          billingFirstName: deliveryInformation.value.billingFirstName,
          billingLastName: deliveryInformation.value.billingLastName,
          billingAddress: deliveryInformation.value.billingAddress,
          billingPhoneNumber: deliveryInformation.value.billingPhoneNumber,
        });

        const selectedShippingMethod = shippingMethodsStore.shippingMethods.find(method => method.id === shippingMethodId.value);
        const totalShippingCost = selectedShippingMethod ? selectedShippingMethod.cost : 0;

        router.push({
          name: 'OrderDetails',
          params: { orderId },
          query: { totalShippingCost: totalShippingCost.toString() }
        });
      } catch (e) {
        if (e instanceof ZodError) {
          errors.value = e.errors.map((error) => error.message).join(' | ');
        } else {
          console.error(e)
          errors.value = e.message;
        }
      }
    };

    return {
      shippingMethods,
      onShippingOptionChange,
      onDeliveryInformationsChange,
      createDelivery,
      errors,
    };
  },
});
</script>
