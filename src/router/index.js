import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CommunityList from '@/components/community/CommunityList.vue';
import ReminderHome from '@/components/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/components/reminder/ReminderForm.vue';
import MealForm from '@/components/meal/MealForm.vue';
import Join from '@/views/Join.vue';
import HealthMain from '@/views/health/HealthMain.vue';
import ElogDetail from '@/views/health/ElogDetail.vue';
import ElogForm from '@/views/health/ElogForm.vue';
import HlogDetail from '@/views/health/HlogDetail.vue';
import HlogForm from '@/views/health/HlogForm.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';

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
