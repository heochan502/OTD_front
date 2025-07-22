import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

import CommunityList from '@/components/community/CommunityList.vue';

import ReminderHome from '@/components/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/components/reminder/ReminderForm.vue';
import Memo from '@/components/memo/MemoDetail.vue';
import Diary from '@/components/memo/DiaryDetail.vue';

import MealForm from '@/views/meal/MealForm.vue';

import HealthMain from '@/views/health/HealthMain.vue';
import ElogDetail from '@/views/health/ElogDetail.vue';
import ElogForm from '@/views/health/ElogForm.vue';
import HlogDetail from '@/views/health/HlogDetail.vue';
import HlogForm from '@/views/health/HlogForm.vue';

import Join from '@/views/Join.vue';
import Login from '@/views/Login.vue';

import Profile from '@/views/Profile.vue';

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
      path: '/reminderform',
      name: 'reminderform',
      component: ReminderForm,
    },
    {
      path: '/meal',
      name: 'MealForm',
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
<<<<<<< HEAD
      path: '/profile',
      name: 'profile',
=======
      path: "/profil",
      name: "profile",
>>>>>>> 9827de1f66087cfcb72d5fc01b2861797fd8afc0
      component: Profile,
    },
        {
      path: "/memo/",
      name: "memo",
      component: Memo,
      props: true,
    },
        {
      path: "/diary",
      name: "diary",
      component: Diary,
      props: true,
    },
  ],
});

export default router;
