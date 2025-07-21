<<<<<<< HEAD
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import CommunityList from "@/components/community/CommunityList.vue";
import ReminderHome from "@/components/reminder/ReminderHome.vue";
import RoutineHome from "@/components/routine/RoutineHome.vue";
import ReminderForm from "@/components/reminder/ReminderForm.vue";
import MealForm from "@/components/meal/MealForm.vue";
import HealthMain from "@/views/health/HealthMain.vue";
import ElogDetail from "@/views/health/ElogDetail.vue";
import ElogForm from "@/views/health/ElogForm.vue";
import HlogDetail from "@/views/health/HlogDetail.vue";
import HlogForm from "@/views/health/HlogForm.vue";

import Join from "@/views/Join.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
=======
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import CommunityList from '@/components/community/CommunityList.vue';
import ReminderHome from '@/components/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/components/reminder/ReminderForm.vue';
import MealForm from '@/components/meal/MealForm.vue';

import HealthMain from '@/views/health/HealthMain.vue';
import ElogDetail from '@/views/health/ElogDetail.vue';
import ElogForm from '@/views/health/ElogForm.vue';
import HlogDetail from '@/views/health/HlogDetail.vue';
import HlogForm from '@/views/health/HlogForm.vue';

import Join from '@/views/Join.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
>>>>>>> d5a7c31c55bb2e10dec10fb1f6ae7a8a4275578c

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityList,
    },
    {
      path: '/reminder',
      name: 'reminder',
      component: ReminderHome,
    },
    {
      path: '/routine',
      name: 'routine',
      component: RoutineHome,
    },
    {
      path: '/reminderadd',
      name: 'reminderadd',
      component: ReminderForm,
    },
    {
<<<<<<< HEAD
      path: "/meal",
      name: "MealForm",
=======
      path: '/meal',
      name: 'MealForm',
>>>>>>> d5a7c31c55bb2e10dec10fb1f6ae7a8a4275578c
      component: MealForm,
    },
    {
      path: '/health',
      name: 'healthMain',
      component: HealthMain,
    },
    {
      path: '/elog/:exerciselog_id',
      name: 'ElogDetail',
      component: ElogDetail,
    },
    {
      path: '/elog/add',
      name: 'ElogForm',
      component: ElogForm,
    },
    {
      path: '/hlog/:healthlog_id',
      name: 'HlogDetail',
      component: HlogDetail,
    },
    {
      path: '/hlog/add',
      name: 'HlogForm',
      component: HlogForm,
    },
    {
<<<<<<< HEAD
      path: "/signup",
      name: "join",
=======
      path: '/signup',
      name: 'join',
>>>>>>> d5a7c31c55bb2e10dec10fb1f6ae7a8a4275578c
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
    },
  ],
});

export default router;
