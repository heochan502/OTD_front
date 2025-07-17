import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CommunityList from '@/components/community/CommunityList.vue';

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
      component: CommunityList,
    },
  ],
});

export default router;
