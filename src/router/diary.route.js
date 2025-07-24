export default [
    {
        path: '/otd/diary',
        name: 'diary-list',
        component: () => import('@/components/memo/Diary.vue'),
    },
    {
        path: '/otd/diary/add',
        name: 'diary-add',
        component: () => import('@/components/memo/DiaryDetail.vue'),
    },
    {
        path: '/otd/diarys/:id',
        name: 'diary:id',
        component: () => import('@/components/memo/DiaryDetail.vue'),
    },
];