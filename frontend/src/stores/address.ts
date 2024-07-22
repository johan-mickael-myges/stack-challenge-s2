import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import {z} from 'zod';

export const SuggestionSchema = z.object({
    adresse: z.string(),
    code: z.string(),
});

const SuggestionsSchema = z.array(SuggestionSchema);

export const useAddressStore = defineStore('address', () => {
    const address = ref('');
    const addressError = ref('');
    const addressLoading = ref(false);
    const addressSuggestions = ref([] as z.infer<typeof SuggestionsSchema>);

    const verifyAddress = async (query: string) => {
        if (query.length < 3) {
            addressSuggestions.value = [];
            return;
        }

        addressLoading.value = true;

        try {
            const response = await axios.get('/laposte/controladresse/v2/adresses', {
                headers: {
                    'X-Okapi-Key': 'LsyWFj+2oA21v5F/vVVZCpQD91H6ffLfROlO+/eAjuZCFOAyB+8ehoBPOPwtncLl',
                },
                params: {
                    q: query,
                },
            });

            addressSuggestions.value = response.data;
            addressError.value = '';
        } catch (error) {
            addressError.value = 'Failed to load address suggestions';
        } finally {
            addressLoading.value = false;
        }
    };

    const selectSuggestion = (suggestion: z.infer<typeof SuggestionSchema>) => {
        address.value = suggestion.adresse;
        addressSuggestions.value = [];
    };

    return {
        address,
        addressError,
        addressLoading,
        addressSuggestions,
        verifyAddress,
        selectSuggestion,
    };
});