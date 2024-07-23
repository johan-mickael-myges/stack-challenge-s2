import { defineStore } from 'pinia';
import axios from 'axios';
import { z } from 'zod';

export const SuggestionSchema = z.object({
    adresse: z.string(),
    code: z.string(),
});

const SuggestionsSchema = z.array(SuggestionSchema);

export const useAddressStore = defineStore('address', {
    state: () => ({
        address: '',
        addressError: '',
        addressLoading: false,
        addressSuggestions: [] as z.infer<typeof SuggestionsSchema>,
    }),

    actions: {
        async verifyAddress(query: string) {
            if (query.length < 3) {
                this.addressSuggestions = [];
                return;
            }

            this.addressLoading = true;

            try {
                const response = await axios.get('/laposte/controladresse/v2/adresses', {
                    headers: {
                        'X-Okapi-Key': 'LsyWFj+2oA21v5F/vVVZCpQD91H6ffLfROlO+/eAjuZCFOAyB+8ehoBPOPwtncLl',
                    },
                    params: {
                        q: query,
                    },
                });

                this.addressSuggestions = response.data;
                this.addressError = '';
            } catch (error) {
                this.addressError = 'Failed to load address suggestions';
            } finally {
                this.addressLoading = false;
            }
        },

        selectSuggestion(suggestion: z.infer<typeof SuggestionSchema>) {
            this.address = suggestion.adresse;
            this.addressSuggestions = [];
        },
    },

    getters: {
        getAddress(state) {
            return state.address;
        },
        getAddressError(state) {
            return state.addressError;
        },
        getAddressLoading(state) {
            return state.addressLoading;
        },
        getAddressSuggestions(state) {
            return state.addressSuggestions;
        },
    },
});