import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useReminderStore = defineStore(
  'reminder',
  () => {
    const state = reactive({
      dayReminder: [], // 선택된 날짜의 리마인더
      fullReminder: [], // 한 달 전체 리마인더
    });

    const setDayReminder = (data) => {
      state.dayReminder = data;
    };

    const setFullReminder = (data) => {
      state.fullReminder = data;
    };

    return {
      state,
      setDayReminder,
      setFullReminder,
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
          paths: ['state.dayReminder', 'state.fullReminder'], // 저장할 속성
        },
      ],
    },
  }
);
