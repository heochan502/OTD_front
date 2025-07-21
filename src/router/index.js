import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/layout/Layout.vue';
import CommunityList from '@/components/community/CommunityList.vue';
import ReminderHome from '@/components/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/components/reminder/ReminderForm.vue';

import MealForm from '@/views/MealForm.vue';


import Join from '@/views/Join.vue';
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
      component: ReminderForm
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

      path: '/meal',
      name: 'MealForm',
      component: MealForm
    }

  ],
});

export default router;
