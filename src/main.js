import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

<<<<<<< HEAD
import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import vuetify from "./plugins/vuetify";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
=======
import App from './App.vue';
import router from './router';

import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import vuetify from './plugins/vuetify';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
>>>>>>> ae06d738617b759c3c0357ed1ac4efc464aeb6f7

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(VCalendar, {});

app.mount("#app");
