<template>
  <v-card class="mx-auto mb-4">
    <!-- Personal Information Form -->
    <v-list density="compact">
      <v-list-subheader><p>Vos informations personelles</p></v-list-subheader>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="firstName"
            label="Prénom*"
            outlined
            :rules="[
                v => !!v || 'Le prénom est obligatoire',
                v => (v && v.length >= 2) || 'Le prénom doit contenir au moins 2 caractères',
                v => (v && v.length <= 250) || 'Le prénom doit contenir moins de 250 caractères',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="lastName"
            label="Nom*"
            outlined
            :rules="[
                v => !!v || 'Le nom est obligatoire',
                v => (v && v.length >= 2) || 'Le nom doit contenir au moins 2 caractères',
                v => (v && v.length <= 250) || 'Le nom doit contenir moins de 250 caractères',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="phoneNumber"
            label="Téléphone"
            outlined
            :rules="[
                v => /^[0-9]*$/.test(v) || 'Le numéro de téléphone doit contenir uniquement des chiffres',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>

  <v-card class="mx-auto">
    <!-- Shipping Address Form -->
    <v-list density="compact">
      <v-list-subheader><p>Adresse de livraison</p></v-list-subheader>
      <SuggestAddressField :height="150" @update-value="onAdressChange" />
    </v-list>
  </v-card>

  <v-card class="mx-auto">
    <!-- Checkbox for Using Shipping Address as Billing Address -->
    <v-list density="compact">
      <v-list-item>
        <v-checkbox
          v-model="useShippingAsBilling"
          label="Utiliser l'adresse de livraison comme adresse de facturation"
        ></v-checkbox>
      </v-list-item>
    </v-list>
  </v-card>

  <!-- Billing Address Form -->
  <v-card class="mx-auto" v-if="!useShippingAsBilling">
    <v-list density="compact">
      <v-list-subheader><p>Adresse de facturation</p></v-list-subheader>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="billingFirstName"
            label="Prénom de facturation*"
            outlined
            :rules="[
                v => !!v || 'Le prénom de facturation est obligatoire',
                v => (v && v.length >= 2) || 'Le prénom de facturation doit contenir au moins 2 caractères',
                v => (v && v.length <= 250) || 'Le prénom de facturation doit contenir moins de 250 caractères',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="billingLastName"
            label="Nom de facturation*"
            outlined
            :rules="[
                v => !!v || 'Le nom de facturation est obligatoire',
                v => (v && v.length >= 2) || 'Le nom de facturation doit contenir au moins 2 caractères',
                v => (v && v.length <= 250) || 'Le nom de facturation doit contenir moins de 250 caractères',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="billingPhoneNumber"
            label="Téléphone de facturation"
            outlined
            :rules="[
                v => /^[0-9]*$/.test(v) || 'Le numéro de téléphone de facturation doit contenir uniquement des chiffres',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <v-text-field
            v-model="billingAddress"
            label="Adresse de facturation*"
            outlined
            :rules="[
                v => !!v || 'L\'adresse de facturation est obligatoire',
                v => (v && v.length >= 2) || 'L\'adresse de facturation doit contenir au moins 2 caractères',
                v => (v && v.length <= 250) || 'L\'adresse de facturation doit contenir moins de 250 caractères',
            ]"
          ></v-text-field>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import SuggestAddressField from '@/components/Form/SuggestAddressField.vue';

export default defineComponent({
  name: 'DeliveryInformationsForm',
  emits: ['update-values'],
  components: {
    SuggestAddressField,
  },
  setup(props, { emit }) {
    const firstName = ref('');
    const lastName = ref('');
    const phoneNumber = ref('');
    const address = ref('');
    const billingFirstName = ref('');
    const billingLastName = ref('');
    const billingPhoneNumber = ref('');
    const billingAddress = ref('');
    const useShippingAsBilling = ref(true);

    const onAdressChange = (value: string) => {
      address.value = value;
    };

    watch(
      [firstName, lastName, phoneNumber, address, billingFirstName, billingLastName, billingPhoneNumber, billingAddress, useShippingAsBilling],
      () => {
        const formData = {
          firstName: firstName.value,
          lastName: lastName.value,
          phoneNumber: phoneNumber.value,
          address: address.value,
          billingFirstName: useShippingAsBilling.value ? firstName.value : billingFirstName.value,
          billingLastName: useShippingAsBilling.value ? lastName.value : billingLastName.value,
          billingPhoneNumber: useShippingAsBilling.value ? phoneNumber.value : billingPhoneNumber.value,
          billingAddress: useShippingAsBilling.value ? address.value : billingAddress.value,
        };
        console.log(formData); // Verify the data being emitted
        emit('update-values', formData);
      }
    );


    return {
      firstName,
      lastName,
      phoneNumber,
      address,
      billingFirstName,
      billingLastName,
      billingPhoneNumber,
      billingAddress,
      useShippingAsBilling,
      onAdressChange,
    };
  },
});
</script>
