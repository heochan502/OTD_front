import MemoDetail from '@/components/memo/MemoDetail.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/memo',
        name: 'Memo',
        component: MemoDetail,
        children: [
        {
        path: '',
        name: 'MemoList',
        component: MemoList,
        },
        {
        path: 'add',
        name: 'MemoAdd',
        component: MemoDetail,
        },
        {
        path: ':id',
        name: 'MemoDetail',
        component: MemoDetail,
        props: true,
        },
      ],
    }, 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;