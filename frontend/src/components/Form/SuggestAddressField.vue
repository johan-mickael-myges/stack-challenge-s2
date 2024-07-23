<template>
  <div>
    <v-text-field
        label="Cherchez une adresse"
        v-model="address"
        :error-messages="addressError"
        :loading="addressLoading"
        :rules="[
          (v) => !!v || 'Veuillez saisir une adresse',
          (v) => v.length > 2 || 'L\'adresse doit contenir au moins 3 caractères',
          (v) => v.length < 256 || 'L\'adresse doit contenir moins de 256 caractères',
          () => !errorMessage || errorMessage,
        ]"
    />
    <v-virtual-scroll
        v-if="addressSuggestions.length > 0"
        :items="addressSuggestions"
        :height="height"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            density="compact"
            @click="selectSuggestion(item)"
        >
          <v-list-item-title>
            <p class="text-sm">{{ item.adresse }}</p>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, watch} from 'vue';
import { SuggestionSchema, useAddressStore } from '@/stores/address.ts';
import { z } from 'zod';
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'SuggestAddressField',
  props: {
    height: {
      type: Number,
      required: false,
      default: 200,
    },
    errorMessage : {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['update-value'],
  setup(props, { emit }) {
    const addressStore = useAddressStore();

    const address = computed({
      get: () => addressStore.address,
      set: (value: string) => {
        addressStore.address = value;
        debouncedVerifyAddress(value);
      },
    });

    const addressError = computed(() => addressStore.addressError);
    const addressLoading = computed(() => addressStore.addressLoading);
    const addressSuggestions = computed(() => addressStore.addressSuggestions);

    const verifyAddress = (value: string) => {
      addressStore.verifyAddress(value);
    };

    const debouncedVerifyAddress = debounce(verifyAddress, 300);

    const selectSuggestion = (suggestion: z.infer<typeof SuggestionSchema>) => {
      addressStore.selectSuggestion(suggestion);
      emit('update-value', suggestion.adresse);
    };

    watch(address, (value) => {
      emit('update-value', value);
    });

    return {
      address,
      addressError,
      addressLoading,
      addressSuggestions,
      selectSuggestion,
    };
  },
});
</script>
