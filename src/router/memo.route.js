import Memo from '@/components/memo/Memo.vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';

export default [
    {
        path: '/otd/memo',
        name: 'Memo',
        component: Memo,
    },
    {
        path: '/otd/memo/add',
        name: 'MemoAdd',
        component: MemoDetail,
    },
    {
        path: '/otd/memo/:id',
        name: 'MemoEdit',
        component: MemoDetail
    },
];