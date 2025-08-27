import { defineStore } from "pinia";
import { getExercise, getElogs } from "@/services/health/elogService";
import { reactive, ref } from "vue";

export const useExerciseStore = defineStore("exercise", {
  state: () =>
    ref({
      exerciseList: [],
      loaded: false,
      todayLog: [],
      calendarDate: [],
      logList: [],
      logs: [],
    }),

  actions: {
    async fetchExercises() {
      if (this.loaded) return;
      const res = await getExercise();
      this.exerciseList = res.data;
      this.loaded = true;
    },
    async fetchExerciselogs() {
      const res = await getElogs();
      this.logs = res.data;
    },
    addCalendarDate(list) {
      this.calendarDate.push(...list);
    },
    clearCalendarDate() {
      this.calendarDate = [];
    },
    addLogList(list) {
      this.logList.push(...list);
    },
    clearLogList() {
      this.logList = [];
    },
    addTodayLog(list) {
      this.todayLog.push(...list);
    },
  },

  persist: true,
});
