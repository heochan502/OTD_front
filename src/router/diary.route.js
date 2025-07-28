import { createRouter, createWebHistory } from 'vue-router';
import DiaryList from '@/components/memo/DiaryList.vue';
import DiaryDetail from '@/components/memo/DiaryDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/memoAndDiary/diary',
      name: 'DiaryList',
      component: DiaryList,
    },
    {
      path: '/memoAndDiary/diary/:id',
      name: 'DiaryDetail',
      component: DiaryDetail,
      props: true,  // :id를 DiaryDetail 컴포넌트에 props로 전달
    },
  ],
});

export default router;