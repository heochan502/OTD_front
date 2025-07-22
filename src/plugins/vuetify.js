import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { VCalendar } from "vuetify/labs/VCalendar";
// 캘린더는 vuetify lab에서 가져와쓰는거라 추가로 import했음
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  icons: {
    defaultSet: "mdi",
  },
  // 옵션 추가 가능: theme, locale 등
});
