import { defineStore } from 'pinia';
import {ref} from "vue";

export const useProductStore = defineStore('product', {
    state: (): {
        loading: boolean;
        data: any;
    } => ({
        loading: false,
        data: ref([]),
    }),
    actions: {
        async fetch() : Promise<void> {
            try {
                this.loading = true;
                const response : Response = await fetch(`http://localhost:8000/api/products`);
                this.data.value = await response.json();
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
    }
})