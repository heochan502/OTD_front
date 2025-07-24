import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useReminderStore = defineStore('reminder', () => {
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
});
