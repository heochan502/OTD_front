<script setup>
import { ref, watch } from 'vue';
import { useBaseDate, useDayDefine } from '@/stores/mealStore';

const weekDay = useBaseDate();
const nowDay = useDayDefine();

const selectedDate = ref(nowDay.nowDay); // 초기화 및 선택하는 날짜 들어감 
const weekDates = ref([]);

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
        weekDay.getWeekDate.endDate = weekDates.value[6]
        // console.log("주시작 : ", weekDay.getWeekDate.startDate, nowDay.nowDay );
    },
    { immediate: true }
);



</script>

<template>
    <div>
        <v-text-field v-model="selectedDate" label="날짜 선택" type="date" class="mb-4"></v-text-field>

        <v-list>
            <v-list-item v-for="date in weekDates" :key="date">
                <v-list-item-title>{{ date }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </div>
</template>


<style>


</style>