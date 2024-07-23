<template>
  <v-card class="">
    <v-row>
      <v-col>
        <v-img :src="item.Product.thumbnail" class=""></v-img>
        <v-card-text class="">
          <v-card-title>{{ item.Product.name }}</v-card-title>
          <v-card-subtitle>L'unité: {{ item.Product.price }} €</v-card-subtitle>
          <v-card-subtitle>{{ item.Product.price * item.quantity }} €</v-card-subtitle>
        </v-card-text>
      </v-col>
      <v-col>
        <v-btn icon class="" @click.prevent="removeProductFromCart(item.Product.id)">
          <v-icon size="20px">mdi-delete</v-icon>
        </v-btn>
        <v-select
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            v-model="item.quantity"
            label="Quantité"
            class="small-select rounded-select quantity-select"
            @change="updateQuantity(item.Product.id, item.quantity)"
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductCartItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const updateQuantity = (productId, quantity) => {

    };

    const removeProductFromCart = (productId) => {

    }

    return {
      updateQuantity,
      removeProductFromCart
    }
  },
});
</script>