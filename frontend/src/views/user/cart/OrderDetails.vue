<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Détails de la commande</h1>
        <div v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <div v-if="error" class="error">
            <p>Erreur lors de la récupération des détails de la commande.</p>
          </div>
          <div v-else>
            <p><strong>Numéro de commande:</strong> {{ order.id }}</p>
            <p><strong>Mode de paiement:</strong> {{ order.paymentMethod }}</p>
            <p><strong>Date:</strong> {{ order.createdAt }}</p>
            <div v-for="item in order.OrderItems" :key="item.id">
              <p><strong>Produit:</strong> {{ item.Product.name }}</p>
              <p><strong>Quantité:</strong> {{ item.quantity }}</p>
              <p><strong>Prix unitaire:</strong> {{ item.unitPrice }} €</p>
              <p><strong>Sous-total:</strong> {{ item.subtotal }} €</p>
            </div>
            <p class="font-bold">Total: {{ totalPrice.toFixed(2) }} €</p>
            <div>
              <v-text-field
                label="Prénom du destinataire"
                v-model="recipientFirstName"
              ></v-text-field>
              <v-text-field
                label="Nom du destinataire"
                v-model="recipientLastName"
              ></v-text-field>
              <v-text-field
                label="Adresse"
                v-model="address"
                @input="verifyAddress"
                :error-messages="addressError"
                :loading="addressLoading"
              ></v-text-field>
              <v-list>
                <v-list-item
                  v-for="suggestion in addressSuggestions"
                  :key="suggestion.code"
                  @click="selectSuggestion(suggestion)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ suggestion.adresse }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div>
              <v-radio-group v-model="shippingMethod">
                <v-radio
                  v-for="method in shippingMethods"
                  :key="method.value"
                  :label="method.label"
                  :value="method.value"
                ></v-radio>
              </v-radio-group>
            </div>
            <!-- New Button to Send Delivery Info -->
            <v-btn @click="sendDeliveryInfo">Send Delivery Info</v-btn>
            <div id="paypal-button-container"></div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { usePayPal } from '@/composables/usePayPal';
import useOrderDetails from '@/composables/useOrderDetails';

export default defineComponent({
  name: 'OrderDetails',
  setup() {
    const route = useRoute();
    const orderId = route.params.orderId as string;
    const { order, loading, error, totalPrice, fetchOrderDetails } = useOrderDetails(orderId);
    const { loadPayPalScript, setupPayPalButton } = usePayPal();

    const recipientFirstName = ref('');
    const recipientLastName = ref('');
    const address = ref('');
    const shippingMethod = ref('');
    const addressError = ref('');
    const addressLoading = ref(false);
    const addressSuggestions = ref([]);
    const shippingMethods = ref([
      { label: 'Livraison standard - 3,60 €', value: 'standard' },
      { label: 'Livraison en point relais - 2,30 €', value: 'pointRelais' },
      { label: 'Livraison express - 6,30 €', value: 'express' }
    ]);

    const verifyAddress = async () => {
      if (address.value.length < 3) return;

      addressLoading.value = true;
      addressError.value = '';
      addressSuggestions.value = [];

      try {
        const response = await axios.get(`/api/controladresse/v2/adresses`, {
          params: { q: address.value },
          headers: { 'X-Okapi-Key': 'LsyWFj+2oA21v5F/vVVZCpQD91H6ffLfROlO+/eAjuZCFOAyB+8ehoBPOPwtncLl' },
        });

        console.log('Address suggestions:', response.data);

        if (Array.isArray(response.data)) {
          addressSuggestions.value = response.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        addressError.value = 'Error verifying address';
        console.error('Error verifying address:', err);
      } finally {
        addressLoading.value = false;
      }
    };

    const selectSuggestion = (suggestion) => {
      address.value = suggestion.adresse;
      addressSuggestions.value = [];
    };

    const sendDeliveryInfo = async () => {
      try {
        const fullName = `${recipientFirstName.value} ${recipientLastName.value}`;
        
        const response = await axios.post('http://localhost:8000/orders/update-delivery', {
          orderId,
          shippingMethod: shippingMethod.value,
          address: address.value,
          recipientName: fullName,
        }, {
          withCredentials: true,
        });

        console.log('Delivery details updated:', response.data);
        alert('Delivery info sent successfully!');
      } catch (err) {
        console.error('Failed to send delivery info:', err);
        alert('Failed to send delivery info.');
      }
    };

    onMounted(async () => {
      await fetchOrderDetails();
      nextTick(() => {
        console.log('Mounting PayPal button with values:', {
          totalPrice: totalPrice.value,
          orderId,
          recipientFirstName: recipientFirstName.value,
          recipientLastName: recipientLastName.value,
          address: address.value,
          shippingMethod: shippingMethod.value
        });
        loadPayPalScript(() => setupPayPalButton(
          totalPrice.value,
          orderId,
          recipientFirstName.value,
          recipientLastName.value,
          address.value,
          shippingMethod.value
        ));
      });
    });

    return {
      order,
      loading,
      error,
      totalPrice,
      recipientFirstName,
      recipientLastName,
      address,
      shippingMethod,
      addressError,
      addressLoading,
      addressSuggestions,
      shippingMethods,
      verifyAddress,
      selectSuggestion,
      sendDeliveryInfo
    };
  },
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
