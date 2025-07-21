import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CommunityList from '@/components/community/CommunityList.vue';
import ReminderHome from '@/components/reminder/ReminderHome.vue';
import RoutineHome from '@/components/routine/RoutineHome.vue';
import ReminderForm from '@/components/reminder/ReminderForm.vue';
<<<<<<< HEAD
import MealForm from '@/views/MealForm.vue';
=======

import Join from '@/views/Join.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';

import MealForm from '@/components/meal/MealForm.vue';
>>>>>>> f0d24381e0b48296b295edef9066a6976e8cd2e0

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
