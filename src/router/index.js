import { createRouter, createWebHistory } from "vue-router";
import { useAccountStore } from '@/stores/counter';

import ReminderHome from "@/views/reminder/ReminderHome.vue";
import RoutineHome from "@/components/routine/RoutineHome.vue";
import ReminderForm from "@/views/reminder/ReminderForm.vue";
import ReminderList from "@/views/reminder/ReminderList.vue";

import Memo from "@/components/memo/MemoDetail.vue";
import Diary from "@/components/memo/DiaryDetail.vue";

import CommunityView from "@/views/community/CommunityView.vue";

import MealForm from "@/views/meal/MealForm.vue";
import MealAdd from "@/components/meal/MealAdd.vue";

import HealthMain from "@/views/health/HealthMain.vue";
import ElogDetail from "@/views/health/ElogDetail.vue";
import ElogForm from "@/views/health/ElogForm.vue";
import HlogDetail from "@/views/health/HlogDetail.vue";
import HlogForm from "@/views/health/HlogForm.vue";

import Join from "@/views/Join.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";

import Location from "@/components/location/Location.vue";
import ProfileDetail from "@/views/ProfileDetail.vue";
import ElogEdit from "@/views/health/ElogEdit.vue";



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
      meta: { requiresAuth: true }
    },
    {
      path: "/reminder",
      name: "reminder",
      component: ReminderHome,
      meta: { requiresAuth: true }
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
      path: "/routine",
      name: "routine",
      component: RoutineHome,
      meta: { requiresAuth: true }
    },
    {
      path: "/meal",
      name: "MealForm",
      component: MealForm,
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true }
    },
    {
      path: "/location",
      name: "location",
      component: Location,
      meta: { requiresAuth: true }
    },
    {
      path: "/memo",
      name: "memo",
      component: Memo,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: "/diary",
      name: "diary",
      component: Diary,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/detail',
      name: 'profile_detail',

      component: ProfileDetail,
    },
  ],
});


router.beforeEach((to) => {
  const accountStore = useAccountStore();

  if (to.meta.requiresAuth && !accountStore.state.loggedIn) {
    return '/login';
  }

});

export default router;