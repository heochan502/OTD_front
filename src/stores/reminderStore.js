import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useReminderStore = defineStore(
  'reminder',
  () => {
    const state = reactive({
      fullReminder: [], // 한 달 전체 리마인더
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      selectedDate: '',
    });

    const reload = ref(false);

    const setFullReminder = (data) => {
      state.fullReminder = data;
    };

    const setCurrentYear = (data) => {
      state.currentYear = data;
    };

    const setCurrentMonth = (data) => {
      state.currentMonth = data;
    };

    const setSelectedDate = (data) => {
      state.selectedDate = data;
    };

    const setReload = (data) => {
      reload.value = data;
    };

    return {
      state,
      setFullReminder,
      setCurrentYear,
      setCurrentMonth,
      setSelectedDate,
      setReload,
      reload,
    };
  },
  {
    persist: {
      // true만 써도 전체 state가 localStorage에 저장됨
      enabled: true,
      strategies: [
        {
          key: 'reminder', // localStorage에 저장될 이름
          storage: localStorage, // 기본값이 이거임 (생략 가능)
          paths: ['state.fullReminder', 'state.currentYear', 'state.currentMonth', 'state.selectedDate'], // 저장할 속성
        },
      ],
    },
  }
);
