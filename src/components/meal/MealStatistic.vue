<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useBaseDate, useDayDefine, useWeeklyStore } from '@/stores/mealStore';

import { getWeekTotal } from '@/services/meal/mealService'

const weekDay = useBaseDate();
const nowDay = useDayDefine();
const weeklyStore = useWeeklyStore();

const selectedDate = ref(nowDay.nowDay); // 초기화 및 선택하는 날짜 들어감
const weekDates = ref([]);

// 날짜 : 각종 량 출력 하는거 하다가 맒
// const getYData = computed(async () => {
//   const days = ['월', '화', '수', '목', '금', '토', '일'];
//   return  days.map((day, idx) => ({
//     day,
//     calo: weeklyStore.weeklyRawData[idx]?.totalCalorie ?? 0,
//     carbo: weeklyStore.weeklyRawData[idx]?.totalCarbohydrate ?? 0,
//     fat: weeklyStore.weeklyRawData[idx]?.totalFat ?? 0,
//     protein: weeklyStore.weeklyRawData[idx]?.totalProtein ?? 0,
//   }));
// });

function getWeekDates(dateString) {
  const date = new Date(dateString);
  //0 일요일 ~
  const dayOfWeek = date.getDay();

  const startDate = new Date(date);
  // 해당 요일의 번호를 빼서 월요일로 초기화
  startDate.setDate(date.getDate() - dayOfWeek + 1);
  const result = [];

  for (let i = 0; i < 7; i++) {
    // 주 시작 일 과 끝일만 넣기
    //    if(i===0 || i===6){
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    result.push(currentDate.toISOString().slice(0, 10));
    //    }
  }
  return result;
}

watch(
  selectedDate,
 (newDate) => {
    weekDates.value = getWeekDates(newDate);
    weekDay.getWeekDate.startDate = weekDates.value[0];
    weekDay.getWeekDate.endDate = weekDates.value[6];
    console.log(
      '주시작11 : ',
      selectedDate.value,
      weekDay.getWeekDate,
      nowDay.nowDay
    );

    const res =  getWeekTotal(weekDay.getWeekDate);
    if (res.status === 200) {
      weeklyStore.weeklyRawData = res.data;
      console.log("통신구역 " );
    }

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

    <!-- <v-list>
        <v-list-item v-for="date in getYData.value " :key="date.day">
    <v-list-item-title> 출력 부부 ㄴ: {{ date.day }} {{ date.calo }}</v-list-item-title>
    </v-list-item>
    </v-list> -->
  </div>
</template>

<style></style>
