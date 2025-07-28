import { createRouter, createWebHistory } from 'vue-router';
import MemoList from '@/components/memo/MemoList.vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/memoAndDiary/memo',
      name: 'MemoList',
      component: MemoList,
    },
    {
      path: '/memoAndDiary/memo/:id',
      name: 'MemoDetail',
      component: MemoDetail,
      props: true,  // :id를 MemoDetail 컴포넌트에 props로 전달
    },
  ],
});

export default router;