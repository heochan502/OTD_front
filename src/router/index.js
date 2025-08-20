import { createRouter, createWebHistory } from 'vue-router';
import { useAccountStore } from '@/stores/counter';
import ReminderHome from '@/views/reminder/ReminderHome.vue';
import ReminderForm from '@/views/reminder/ReminderForm.vue';
import ReminderList from '@/views/reminder/ReminderList.vue';

import MemoList from '@/components/memo/MemoList.vue';
import DiaryList from '@/components/memo/DiaryList.vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';
import DiaryDetail from '@/components/memo/DiaryDetail.vue';
import MemoAndDiary from '@/views/memo/MemoAndDiary.vue';
import CommunityView from '@/views/community/CommunityView.vue';
// 커뮤니티 클릭했을때 리스트만 보이게 하기 위해 추가한 코드
import { usecommunityStore } from '@/stores/communityStore';

import MealForm from '@/views/meal/MealForm.vue';
import MealAdd from '@/views/meal/MealAdd.vue';
import MealStatistic from '@/components/meal/MealStatistic.vue';

import HealthMain from '@/views/health/HealthMain.vue';
import ElogDetail from '@/views/health/ElogDetail.vue';
import ElogForm from '@/views/health/ElogForm.vue';
import HlogDetail from '@/views/health/HlogDetail.vue';
import HlogForm from '@/views/health/HlogForm.vue';

import Join from '@/views/Join.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import ProfileDetail from '@/views/ProfileDetail.vue';

import Location from '@/components/location/Location.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityView,
      meta: { requiresAuth: true },
    },
    {
      path: '/reminder',
      name: 'reminder',
      component: ReminderHome,
      meta: { requiresAuth: true },
    },
    {
      path: '/reminder/form',
      name: 'reminderform',
      component: ReminderForm,
    },
    {
      path: '/reminder/list',
      name: 'reminderlist',
      component: ReminderList,
    },
    {
      path: '/meal',
      name: 'MealForm',
      component: MealForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/meal/add',
      name: 'MealAdd',
      component: MealAdd,
    },
    {
      path: '/meal/MealStatistic',
      name: 'MealStatistic',
      component: MealStatistic,
    },
    {
      path: '/health',
      name: 'healthMain',
      component: HealthMain,
      meta: { requiresAuth: true },
    },
    {
      path: '/elog/:exerciselogId',
      name: 'ElogDetail',
      component: ElogDetail,
    },
    {
      path: '/elog/form',
      name: 'ElogForm',
      component: ElogForm,
    },
    {
      path: '/hlog/:healthlogId',
      name: 'HlogDetail',
      component: HlogDetail,
    },
    {
      path: '/hlog/add',
      name: 'HlogForm',
      component: HlogForm,
    },
    {
      path: '/signup',
      name: 'join',
      component: Join,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/location',
      name: 'location',
      component: Location,
      meta: { requiresAuth: true },
    },
    {
      path: '/memoAndDiary',
      name: 'memoAndDiary',
      component: MemoAndDiary,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/memoAndDiary/memo',
      name: 'memo',
      component: MemoDetail,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/memoAndDiary/diary',
      name: 'diary',
      component: DiaryDetail,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/memoAndDiary/memolist',
      name: 'MemoList',
      component: MemoList,
      props: true,
    },
    {
      path: '/memoAndDiary/diarylist',
      name: 'DiaryList',
      component: DiaryList,
      props: true,
    },
    {
      path: '/detail',
      name: 'profile_detail',
      component: ProfileDetail,
      meta: { requiresAuth: true },
    },
  ],
});
router.beforeEach((to) => {
  const accountStore = useAccountStore();
  if (to.meta.requiresAuth && !accountStore.state.loggedIn) {
    return '/login';
  }
  // 커뮤니티 진입 시 항상 리스트 모드로 강제
  if (to.path === '/community') {
    const cstore = usecommunityStore();
    cstore.clearSelectedPost?.(); // 선택 글 초기화
    cstore.goList?.();            // viewMode = 'list'
  }
});
export default router;
