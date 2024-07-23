<template>
  <v-card
      class="mx-auto mb-4"
  >
    <v-list density="compact">
      <v-list-subheader><p>Choisissez votre mode de livraison</p></v-list-subheader>
      <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          @click="onSelectedShippingMethod(item)"
          active-class="font-bold"
      >
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <template v-slot:append>
          <span>€ {{ item.cost }}</span>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ShippingMethod} from "@/stores/shippingMethods.ts";

export default defineComponent({
  name: 'ShippingOptionsForm',
  props: {
    items: {
      type: [Array as () => ShippingMethod[]],
      required: true,
    },
  },
  emits: ['update-values'],
  setup(props, {emit}) {

    const onSelectedShippingMethod = (shippingMethod: ShippingMethod) => {
      emit('update-values', shippingMethod);
    };

    return {
      onSelectedShippingMethod,
    };
  },
});
</script>
