import {defineStore} from 'pinia';

export const usePageStore = defineStore('pages', {
    state() {
        return {
            navbarHeight: 0,
        }
    },

    actions: {
        calculateNavbarHeight() {
            this.navbarHeight = document.getElementById('navbar')?.offsetHeight ?? 0;
        }
    },

    getters: {
        navbarHeightWithPx(): string {
            return `${this.navbarHeight}px`;
        },

        contentHeightWithPx(): string {
            return `calc(100vh - ${this.navbarHeightWithPx})`;
        }
    }
});