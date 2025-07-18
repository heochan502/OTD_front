import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CommunityList from '@/components/community/CommunityList.vue';
import ReminderHome from '@/components/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/components/reminder/ReminderForm.vue';
import Join from '@/views/Join.vue';

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
      component: ReminderForm
    },
    {
      path: '/signup',
      name: 'join',
      component: Join,
    },
  ],
});

export default router;
