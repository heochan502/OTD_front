import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { getHlogs } from "@/services/health/hlogService";

export const useHealthStore = defineStore("health", {
  state: () =>
    ref({
      logs: [],
      calendarDate: [],
    }),
  actions: {
    async fetchHealthlogs() {
      const res = await getHlogs();
      this.logs = res.data;
    },

    addCalendarDate(list) {
      this.calendarDate.push(...list);
    },
    clearCalendarDate() {
      this.calendarDate = [];
    },
  },
});
