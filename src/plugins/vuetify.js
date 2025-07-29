import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { VCalendar } from 'vuetify/labs/VCalendar';
// 캘린더는 vuetify lab에서 가져와쓰는거라 추가로 import했음
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#3bbeff', // 여기서 primary 컬러 변경
          // 글씨색은 컴포넌트마다 다르게 쓰일 수 있기 때문에 전역 설정이 어렵
          // 필요 시 다른 색상도 추가 가능
          // secondary: '#ff4081',
        },
      },
    },
  },
});
