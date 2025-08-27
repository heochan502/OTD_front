import "vuetify/styles";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";
import vuetify from "./plugins/vuetify";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();

// persist 등록
pinia.use(piniaPluginPersistedstate);

// app.use(createPinia());
app.use(router);
app.use(vuetify);
// app.use(VCalendar, {});
app.use(VCalendar, {
  componentPrefix: "vc", // 모든 컴포넌트 이름 앞에 vc- 붙음
});

app.use(pinia);
app.mount("#app");
