import { defineStore } from "pinia";
import { reactive } from "vue";
import { getHlogs } from "@/services/health/hlogService";


//day js 사용하기위한거
import dayjs from "dayjs";

import "dayjs/locale/ko";

dayjs.locale("ko");
// 한글로 월화수 이렇게 나오게 하는거

export const useHealthStore = defineStore("health", {
  state: () =>
    reactive({
      logs: [],
    }),
  actions: {
    async fetchHealthlogs() {
      // 현재 날짜로 지정
      const date =new Date();
      // 현재 날짜의 인덱스를 가져옴 일 0 월 1 화 2 
      const dayOfWeek = date.getDay();
      // 시작 날짜를 현재 날짜로 일단 설정 함
      let startDate = new dayjs(date).format('YYYY-MM-DD');

      if (dayOfWeek === 0) { // 일요일이라면 startDate(현재 날짜)에서 -6으로 월요일로 위치하게함
        startDate = dayjs(new Date()).subtract(6, 'day').format('YYYY/MM/DD');
      } 
      else { // 처음 실행 될때는 만약 수요일이면 3 - 3 + 1 => 이게 1 되면서 월요일로 세팅
        // 여기서 처음 startDate가 그 해당 주차 월요일로 변경됨 
        // startDate = (date.getDate() - dayOfWeek + 1);
        startDate = dayjs(new Date()).add(1 - dayOfWeek, 'day').format('YYYY/MM/DD');;
        console.log("시작날 : ", startDate);
      }
      
      // 날짜 데이터 넣을 곳 만들고 
      const result = [];
      // 일주일 치니까 일주일 동안 돌게 7번
      for (let i = 0; i < 7; i++) {
        // startDate 기준으로 for문 돌면서 월요일 부터 일요일 까지 날짜 뽑기
        let weekDate =  new dayjs(startDate).format('YYYY-MM-DD');
        weekDate = dayjs(startDate).add(i, 'day').format('YYYY/MM/DD');
        result.push(weekDate);
        // console.log("날짜 : ", weekDate);      
      }
    //  console.log("날짜 만든거 : ", result);
      const weekly = {
        startDate : result[0],
        endDate : result[6],
      }
     console.log("날짜 : ", weekly);   
      const res = await getHlogs(weekly);
      this.logs = res.data;
    },
  },
});
