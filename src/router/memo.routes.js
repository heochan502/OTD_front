export default [
    {
        path: '/otd/memo',
        name: 'memo-list',
        component: () => import('@/views/Memo.vue'),
    },
    {
        path: '/otd/memo/add',
        name: 'memo-add',
        component: () => import('@/views/MemoDetail.vue'),
    },
    {
        path: '/otd/memo/:id',
        name: 'memo:id',
        component: () => import('@/views/MemoDetail.vue'),
    },
];