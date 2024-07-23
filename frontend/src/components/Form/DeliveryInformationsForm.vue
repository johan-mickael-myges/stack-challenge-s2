<template>
  <v-card
      class="mx-auto mb-4"
  >
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

  <v-card
      class="mx-auto"
  >
    <v-list density="compact">
      <v-list-subheader><p>Adresse de livraison</p></v-list-subheader>
      <SuggestAddressField :height="150" @update-value="onAdressChange" />
    </v-list>
  </v-card>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import SuggestAddressField from '@/components/Form/SuggestAddressField.vue';

export default defineComponent({
  name: 'DeliveryInformationsForm',
  emits: ['update-values'],
  components: {
    SuggestAddressField,
  },
  setup(props, {emit}) {

    const firstName = ref('');
    const lastName = ref('');
    const phoneNumber = ref('');
    const address = ref('');

    const onAdressChange = (value: string) => {
      address.value = value;
    };

    watch([firstName, lastName, phoneNumber, address], () => {
      emit('update-values', {
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        address: address.value,
      });
    });

    return {
      firstName,
      lastName,
      phoneNumber,
      onAdressChange,
    };
  },
});
</script>
