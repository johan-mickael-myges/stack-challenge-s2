import { createApp } from 'vue';
import { createPinia } from "pinia";
import './index.css';

import router from './routes';
import App from './App.vue';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

import { useAuthStore } from '@/stores/auth'; // Importer la fonction useAuthStore

const app = createApp(App);

app.use(router);

const vuetify = createVuetify({
    components,
    directives,
});

app.use(createPinia());
app.use(vuetify);

const authStore = useAuthStore();
authStore.loadUserFromStorage(); // Charger les informations utilisateur depuis le localStorage

app.mount('#app');
