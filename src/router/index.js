import { createRouter, createWebHistory } from "vue-router";
import { useAccountStore } from "@/stores/counter";
import ReminderHome from "@/views/reminder/ReminderHome.vue";
import ReminderForm from "@/views/reminder/ReminderForm.vue";
import ReminderList from "@/views/reminder/ReminderList.vue";

import MemoList from "@/components/memo/MemoList.vue";
import DiaryList from "@/components/memo/DiaryList.vue";
import MemoDetail from "@/components/memo/MemoDetail.vue";
import DiaryDetail from "@/components/memo/DiaryDetail.vue";
import MemoAndDiary from "@/views/memo/MemoAndDiary.vue";
import CommunityView from "@/views/community/CommunityView.vue";

import MealForm from "@/views/meal/MealForm.vue";
import MealAdd from "@/views/meal/MealAdd.vue";
import MealStatistic from "@/components/meal/MealStatistic.vue";

import HealthMain from "@/views/health/HealthMain.vue";
import ElogDetail from "@/views/health/ElogDetail.vue";
import ElogForm from "@/views/health/ElogForm.vue";
import HlogDetail from "@/views/health/HlogDetail.vue";
import HlogForm from "@/views/health/HlogForm.vue";

import Join from "@/views/member/Join.vue";
import Login from "@/views/member/Login.vue";
import Profile from "@/views/member/Profile.vue";
import ProfileDetail from "@/views/member/ProfileDetail.vue";
import ProfilePassword from "@/views/member/Password.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/community",
      name: "community",
      component: CommunityView,
      meta: { requiresAuth: true },
    },
    {
      path: "/reminder",
      name: "reminder",
      component: ReminderHome,
      meta: { requiresAuth: true },
    },
    {
      path: "/reminder/form",
      name: "reminderform",
      component: ReminderForm,
    },
    {
      path: "/reminder/list",
      name: "reminderlist",
      component: ReminderList,
    },
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
      path: "/meal/MealStatistic",
      name: "MealStatistic",
      component: MealStatistic,
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
      path: "/hlog/:healthlogId",
      name: "HlogDetail",
      component: HlogDetail,
    },
    {
      path: "/hlog/add",
      name: "HlogForm",
      component: HlogForm,
    },
    {
      path: "/signup",
      name: "join",
      component: Join,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/detail',
      name: 'profile_detail',
      component: ProfileDetail,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/password",
      name: "profile_password",
      component: ProfilePassword,
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
      path: "/memoAndDiary/memo",
      name: "memo",
      component: MemoDetail,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/memoAndDiary/diary",
      name: "diary",
      component: DiaryDetail,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/memoAndDiary/memo/list',
      name: 'MemoList',
      component: MemoList,
      props: true,
    },
    {
      path: '/memoAndDiary/diary/list',
      name: 'DiaryList',
      component: DiaryList,
      props: true,
    },
    {
      path: "/detail",
      name: "profile_detail",
      component: ProfileDetail,
      meta: { requiresAuth: true },
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
