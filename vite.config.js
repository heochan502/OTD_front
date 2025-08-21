import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import vuetify from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      //커뮤니티에서 정적 파일도 백엔드로 프록시 하기위한 코드
      '/files':{
        target:'http://localhost:8080',
        changeOrigin:true,
      }
    },
  },
  build: {
    outDir: 'C:/Download',
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    //vueDevTools(),
    vuetify({ autoImport: true }), // vuetify 자동 구성
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
