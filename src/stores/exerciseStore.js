import { defineStore } from "pinia";
import { getExercise, getElogs } from "@/services/health/elogService";
import { reactive, ref, computed } from "vue";
import {
  getDateString,
  getYesterdayDateString,
  filterExerciseLogsByDate,
} from "@/utils/reportUtils";

export const useExerciseStore = defineStore("exercise", {
  state: () => ({
    exerciseList: [],
    loaded: false,
    today: [], // 오늘 기록
    yesterday: [], // 어제 기록
    calendarDate: [],
    logList: [], // 페이징처리한 리스트
    logs: [],
  }),

  actions: {
    async fetchExercises() {
      if (this.loaded) return;
      const res = await getExercise();
      this.exerciseList = res.data;
      this.loaded = true;
    },

    addCalendarDate(list) {
      this.calendarDate.push(...list);
    },
    clearCalendarDate() {
      this.calendarDate = [];
    },
    addLogList(list) {
      this.logList.push(...list);

      // 리포트에 사용할 데이터 따로 저장
      const todayStr = getDateString(); // 오늘 날짜
      const yesterdayStr = getYesterdayDateString(); // 어제 날짜

      // 오늘 기록
      const todayLogs = filterExerciseLogsByDate(this.logList, todayStr);

      // 어제 기록
      const yesterdayLogs = filterExerciseLogsByDate(
        this.logList,
        yesterdayStr
      );

      this.addToday(todayLogs);
      this.addYesterDay(yesterdayLogs);
    },
    clearLogList() {
      this.logList = [];
    },
    addToday(list) {
      const newLogs = list.filter(
        (log) => !this.today.some((t) => t.exerciselogId === log.exerciselogId)
      );
      this.today.push(...newLogs);
    },

    addYesterDay(list) {
      const newLogs = list.filter(
        (log) =>
          !this.yesterday.some((t) => t.exerciselogId === log.exerciselogId)
      );
      this.yesterday.push(...newLogs);
    },
  },

  persist: true,
});
