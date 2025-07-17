import { createRouter, createWebHistory } from 'vue-router';
import memoRoutes from './memo.routes';
import diaryRoutes from './diary.routes';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/memo',
    name: 'memo',
    component: () => import('@/views/Memo.vue'),
  },
  {
    path: '/diary',
    name: 'diary',
    component: () => import('@/views/Diary.vue'),
  },
  ...memoRoutes,
  ...diaryRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  });

export default router;