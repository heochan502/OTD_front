import Memo from '@/components/memo/Memo.vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/memo',
        name: 'Memo',
        component: Memo,
    },
    {
        path: '/memo/add',
        name: 'MemoAdd',
        component: MemoDetail,
    },
    {
        path: '/memo',
        name: 'MemoList',
        component: MemoList
    },
    {
        path: '/memo/:id',
        name: 'MemoDetail',
        component: MemoDetail,
        props: true
    },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;