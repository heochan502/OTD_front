import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Community from '@/views/community/Communityview.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/community',
      name: 'community',
      component: Community,
    },
  ],
});

export default router;
