export default [
    {
        path: '/otd/diary',
        name: 'diary-list',
        component: () => import('@/views/Diary.vue'),
    },
    {
        path: '/otd/diary/add',
        name: 'diary-add',
        component: () => import('@/views/Diary.vue'),
    },
    {
        path: '/otd/diarys/:id',
        name: 'diary:id',
        component: () => import('@/views/DiaryDetail.vue'),
    },
];