import { createRouter, createWebHistory } from 'vue-router';

import CommunityList from '@/components/community/CommunityList.vue';

import ReminderHome from '@/views/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/views/reminder/ReminderForm.vue';
import ReminderList from '@/views/reminder/ReminderList.vue';

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
      path: '/routine',
      name: 'routine',
      component: RoutineHome,
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
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
  ],
});

export default router;
