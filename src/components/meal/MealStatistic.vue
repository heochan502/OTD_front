<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useBaseDate, useDayDefine, useWeeklyStore, useCalorieCalcul } from '@/stores/mealStore';

import { getWeekTotal } from '@/services/meal/mealService'
import dayjs from "dayjs";

import "dayjs/locale/ko";

dayjs.locale("ko");


const weekDay = useBaseDate();
const nowDay = useDayDefine();
const weeklyStore = useWeeklyStore();
const ondayMealData = useCalorieCalcul();

const selectedDate = ref(ondayMealData.itemInfo.mealDay); // 초기화 및 선택하는 날짜 들어감
const weekDates = ref([]);

const getWeekDates = (dateString) => {
  // 오늘 날짜 까져옴
  const date = new Date(dateString);

  //0 일요일 ~
  const dayOfWeek = date.getDay();

  // console.log("선택된 날짜 : ", date, "요일 : ", dayOfWeek);
  
  // 현재 나 선택한 날짜 

  const startDate = new Date(date);

  // console.log(dayOfWeek + 1, typeof dateString);
  // 해당 요일의 번호를 빼서 월요일로 초기화
  if (dayOfWeek === 0) {
    startDate.setDate(startDate.getDate() - 6);
  } 
  else {
    startDate.setDate(date.getDate() - dayOfWeek + 1);
  }
  // console.log("startDate 날짜 : ", startDate, "요일 : ", dayOfWeek);
  const result = [];
  for (let i = 0; i < 7; i++) {
    // console.log(startDate, typeof startDate);
    const weekDate =  new Date(startDate.toISOString().slice(0,10));
    weekDate.setDate(weekDate.getDate() + i);
    // console.log("날짜 겟데이타 : ", startDate.toISOString().slice(0, 10));
    // console.log("날짜 만든거 : ", weekDate);
    result.push(nowDay.updateTime(weekDate).slice(3, 13));
    // console.log("날짜 : ", result[i]);
    
  }
  // 여기서 날짜 관련한 데이터 편집 해야함 
  // 한굴 표기로 
  return result;
}

watch(
  selectedDate,
 (newDate) => {

  if (!newDate) {
    newDate = new dayjs().format('YYYY-MM-DD'); // 선택된 날짜가 없으면 현재 날짜로 설정
    
  } 
  //  console.log("선택된 날짜 : ", ondayMealData.itemInfo.mealDay);
    ondayMealData.mealFormData(newDate);
    weekDates.value = getWeekDates(newDate);

    //여기 데이터 확인 
    weekDay.getWeekDate.startDate = weekDates.value[0];
    weekDay.getWeekDate.endDate = weekDates.value[6];
 

    const res =  getWeekTotal(weekDay.getWeekDate);
    if (res.status === 200) {
      weeklyStore.weeklyRawData = res.data;
      
    }
   weeklyStore.weekyDate = weekDates.value;
  //  console.log("통신구역 ", weeklyStore.weekyDate);

  },
  { immediate: true }
);


</script>

<template>
  <div>
    <v-text-field
      v-model="selectedDate"
      label="날짜 선택"
      type="date"
      class="mb-4 text-black"
      variant="underlined"
    ></v-text-field>
   
  </div>
</template>

<style></style>
