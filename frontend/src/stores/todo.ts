import { defineStore } from 'pinia';
import {ref} from "vue";

export const useTodoStore = defineStore('todo', {
    state: (): {
        count: number;
        loading: boolean;
        data: any;
    } => ({
        count: 0,
        loading: false,
        data: ref([]),
    }),
    actions: {
        async fetch() : Promise<void> {
            try {
                this.loading = true;
                const response : Response = await fetch(`http://localhost:8000/api/todos`);
                this.data.value = await response.json();
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
    }
})