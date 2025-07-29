
import { createRouter, createWebHistory } from 'vue-router';
import { useAccountStore } from '@/stores/counter';


<<<<<<< HEAD
import CommunityView from "@/views/community/CommunityView.vue";
=======
import ReminderHome from '@/views/reminder/ReminderHome.vue';
import ReminderForm from '@/views/reminder/ReminderForm.vue';
import ReminderList from '@/views/reminder/ReminderList.vue';

import Memo from '@/components/memo/MemoDetail.vue';
import Diary from '@/components/memo/DiaryDetail.vue';
>>>>>>> 0bde3dd98c07cc5327002dbcfd5fe25b5b6b72e8

import CommunityView from '@/views/community/CommunityView.vue';

import MealForm from '@/views/meal/MealForm.vue';
import MealAdd from '@/components/meal/MealAdd.vue';
import MealStatistic from '@/components/meal/MealStatistic.vue';

import HealthMain from '@/views/health/HealthMain.vue';
import ElogDetail from '@/views/health/ElogDetail.vue';
import ElogForm from '@/views/health/ElogForm.vue';
import HlogDetail from '@/views/health/HlogDetail.vue';
import HlogForm from '@/views/health/HlogForm.vue';


<<<<<<< HEAD
import MemoAndDiary from "@/views/memo/MemoAndDiary.vue";
import MemoDetail from "@/components/memo/MemoDetail.vue";
import DiaryDetail from "@/components/memo/DiaryDetail.vue";
import MemoList from "@/components/memo/MemoList.vue";
import DiaryList from "@/components/memo/DiaryList.vue";
=======
import Join from '@/views/Join.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';

import Location from '@/components/location/Location.vue';
import ProfileDetail from '@/views/ProfileDetail.vue';

>>>>>>> 0bde3dd98c07cc5327002dbcfd5fe25b5b6b72e8

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
<<<<<<< HEAD
    {
      path: "/meal",
      name: "MealForm",
      component: MealForm,
      meta: { requiresAuth: true },
    },
    {
      path: "/meal/add",
      name: "MealAdd",
      component: MealAdd,
    },
    {
      path: "/health",
      name: "healthMain",
      component: HealthMain,
      meta: { requiresAuth: true },
    },
    {
      path: "/elog/:exerciselogId",
      name: "ElogDetail",
      component: ElogDetail,
    },
    {
      path: "/elog/form",
      name: "ElogForm",
      component: ElogForm,
    },
    {
      path: "/elog/edit",
      name: "ElogEdit",
      component: ElogEdit,
    },
=======

>>>>>>> 0bde3dd98c07cc5327002dbcfd5fe25b5b6b72e8
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
<<<<<<< HEAD
      path: "/memoAndDiary",
      name: "MemoAndDiary",
      component: MemoAndDiary,
    },
    {
      path: "/memoAndDiary/memo",
      name: "MemoDetail",
      component: MemoDetail,
      props: true,
    },
    {
      path: "/memoAndDiary/diary",
      name: "DiaryDetail",
      component: DiaryDetail,
      props: true,
=======
      path: '/memo',
      name: 'memo',
      component: Memo,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary",
      name: "diary",
      component: Diary,
      props: true,
      meta: { requiresAuth: true },
>>>>>>> 0bde3dd98c07cc5327002dbcfd5fe25b5b6b72e8
    },
    {
      path: "/memoAndDiary/memolist",
      name: "MemoList",
      component: MemoList,
      props: true,
    },
    {
      path: "/memoAndDiary/diarylist",
      name: "DiaryList",
      component: DiaryList,
      props: true,
    },
    {
      path: "/detail",
      name: "profile_detail",
      component: ProfileDetail,
<<<<<<< HEAD
=======
      meta: { requiresAuth: true },
>>>>>>> 0bde3dd98c07cc5327002dbcfd5fe25b5b6b72e8
    },
  ],
});

router.beforeEach((to) => {
  const accountStore = useAccountStore();
  if (to.meta.requiresAuth && !accountStore.state.loggedIn) {
    return "/login";
  }
});

export default router;
