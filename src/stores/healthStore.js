import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { getHlogs } from "@/services/health/hlogService";
import dayjs from "dayjs"; // dayjs 사용
import "dayjs/locale/ko";
import { add } from "lodash";

dayjs.locale("ko"); // 한글로 월화수 이렇게 나오게 하는거

export const useHealthStore = defineStore("health", {
  // res: () => reactive({
  //   data: null,
  // }),
  state: () =>
    ref({
      logs: [],
      calendarDate: [],
      logList: [],
      todayLog: [],
    }),
  actions: {
    async fetchHealthlogs() {
      const weekly = makeWeekly();
      // let res = null;
      let res = await getHlogs(weekly);
      this.logs = res.data;
      let count = 0;
      // 데이터 못가져왔을때
      while (this.logs.length === 0 && count < 52) {
        weekly.startDate = dayjs(weekly.startDate)
          .subtract(7, "day")
          .format("YYYY-MM-DD");
        weekly.endDate = dayjs(weekly.endDate)
          .subtract(7, "day")
          .format("YYYY-MM-DD");
        res = await getHlogs(weekly);
        this.logs = res.data;
        console.log("건강기록 가져온 값", this.logs);
        count++;
      }
      if (count < 52) {
        console.log("최근 1년동안의 데이터가 없습니다.");
      }
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

export const makeWeekly = () => {
  // 현재 날짜로 지정
  const date = new Date();
  // 현재 날짜의 인덱스를 가져옴 일 0 월 1 화 2
  const dayOfWeek = date.getDay();
  // 시작 날짜를 받아온 날짜가 있으면 그 날짜로 설정, 없으면 현재 날짜로 설정

  let startDate = new dayjs(date).format("YYYY-MM-DD");

  // 일요일이라면 startDate(현재 날짜)에서 -6으로 월요일로 위치하게함
  if (dayOfWeek === 0) {
    startDate = dayjs(new Date()).subtract(6, "day").format("YYYY-MM-DD");
  } else {
    // 처음 실행 될때는 만약 수요일이면 3 - 3 + 1 => 이게 1 되면서 월요일로 세팅
    // 여기서 처음 startDate가 그 해당 주차 월요일로 변경됨
    // startDate = (date.getDate() - dayOfWeek + 1);
    startDate = dayjs(new Date())
      .add(1 - dayOfWeek, "day")
      .format("YYYY-MM-DD");
  }
  // 날짜 데이터 넣을 곳 만들고
  const result = [];
  // 일주일 치니까 일주일 동안 돌게 7번
  for (let i = 0; i < 7; i++) {
    // startDate 기준으로 for문 돌면서 월요일 부터 일요일 까지 날짜 뽑기
    let weekDate = new dayjs(startDate).format("YYYY-MM-DD");
    weekDate = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
    result.push(weekDate);
  }

  return {
    startDate: result[0],
    endDate: result[6],
  };
};
