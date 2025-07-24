import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import vuetify from "./plugins/vuetify";
import VCalendar from "v-calendar";
import "v-calendar/style.css";


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(VCalendar, {});

app.mount("#app");
