import DiaryDetail from '@/components/diary/DiaryDetail.vue';

export default [
  {
    path: '/diary/create',
    name: 'DiaryCreate',
    component: DiaryDetail,
    props: true,
  },
  {
    path: '/diary/:id',
    name: 'DiaryDetail',
    component: DiaryDetail,
    props: true,
  },
];