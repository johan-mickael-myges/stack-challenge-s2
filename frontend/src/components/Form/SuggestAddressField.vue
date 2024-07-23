<template>
  <div>
    <v-text-field
        label="Cherchez une adresse"
        v-model="address"
        :error-messages="getErrors()"
        :loading="addressLoading"
        max-errors="5"
    >
    </v-text-field>
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
import {useFieldValidator} from "@/composables/useFieldValidator.ts";
import {AddressFieldSchema} from "@/types/schemas/address.ts";

export default defineComponent({
  name: 'SuggestAddressField',
  props: {
    height: {
      type: Number,
      required: false,
      default: 200,
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


    const { setValue, isValid, getErrors, validate } = useFieldValidator(AddressFieldSchema);

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
      setValue(address.value);
      validate();
      emit('update-value', value);
    });

    return {
      address,
      addressError,
      addressLoading,
      addressSuggestions,
      selectSuggestion,
      getErrors,
      validate,
      isValid
    };
  },
});
</script>
