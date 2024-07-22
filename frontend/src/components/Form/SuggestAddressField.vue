<template>
  <div>
    <v-text-field
        label="Adresse"
        v-model="address"
        :error-messages="addressError"
        :loading="addressLoading"
    />
    <v-virtual-scroll
        v-if="addressSuggestions.length > 0"
        :items="addressSuggestions"
        height="150"
    >
      <template v-slot:default="{ item }">
        <v-list-item
            :title="item.adresse"
            density="compact"
            @click="selectSuggestion(item)"
        >
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { SuggestionSchema, useAddressStore } from '@/stores/address.ts';
import { z } from 'zod';
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'SuggestAddressField',
  setup() {
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
    };

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
