import DiaryCreate from '@/components/diary/DiaryCreate.vue';
import DiaryDetail from '@/components/diary/DiaryDetail.vue';

export default [
  {
    path: '/diary/add',
    name: 'DiaryAdd',
    component: DiaryCreate,
  },
  {
    path: '/diary/:id',
    name: 'DiaryDetail',
    component: DiaryDetail,
    props: true,
  },
];
