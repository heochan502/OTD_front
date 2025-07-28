import MemoAndDiary from '@/components/memo/MemoAndDiary.vue'; // 이전 MemoMenu.vue
import MemoList from '@/components/memo/MemoList.vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';

export default [
  {
    path: '/memo',
    name: 'MemoMenu',
    component: MemoAndDiary,
  },
  {
    path: '/memo/create',
    name: 'MemoAdd',
    component: MemoList,
  },
  {
    path: '/memo/:id',
    name: 'MemoDetail',
    component: MemoDetail,
    props: true,
  },
];