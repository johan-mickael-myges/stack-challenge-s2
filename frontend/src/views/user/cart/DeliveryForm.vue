<template>
    <div>
      <h2>Delivery Information</h2>
      <form @submit.prevent="submitDeliveryInfo">
        <v-text-field v-model="deliveryInfo.name" label="Name" required></v-text-field>
        <v-text-field v-model="deliveryInfo.address" label="Address" required></v-text-field>
        <v-text-field v-model="deliveryInfo.city" label="City" required></v-text-field>
        <v-text-field v-model="deliveryInfo.zip" label="Zip Code" required></v-text-field>
        <v-btn type="submit">Proceed to Payment</v-btn>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'DeliveryForm',
    setup(_, { emit }) {
      const deliveryInfo = ref({
        name: '',
        address: '',
        city: '',
        zip: ''
      });
  
      const submitDeliveryInfo = () => {
        emit('submit', deliveryInfo.value);
      };
  
      return {
        deliveryInfo,
        submitDeliveryInfo
      };
    }
  });
  </script>
  
  <style scoped>
  </style>
  