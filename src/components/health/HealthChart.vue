<script setup>
import { computed, onMounted, ref } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import { round, stubArray } from "lodash";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const props = defineProps({
  selectedDate: {
    type: String,
    required: true,
  },
  selectedField: String,
});

const healthStore = useHealthStore();

onMounted(async () => {
  await healthStore.fetchHealthlogs();
});

// 해당 주차 범위
const weekRange = computed(() => {
  const base = dayjs(props.selectedDate);
  return {
    start: base.startOf("isoWeek"), // 월요일
    end: base.endOf("isoWeek"), // 일요일
  };
});

// weekRange에 해당하는 데이터만 필터링
const weeklyLogs = computed(() => {
  return healthStore.logs.filter((log) => {
    const day = dayjs(log.healthlogDatetime);
    return (
      day.isAfter(weekRange.value.start.subtract(1, "day")) &&
      day.isBefore(weekRange.value.end.add(1, "day"))
    );
  });
});

// 요일별 체중 배열 (월~일, 1~7)
const weeklyData = computed(() => {
  const days = Array(7).fill(null);
  weeklyLogs.value.forEach((log) => {
    const day = dayjs(log.healthlogDatetime);
    const weekday = day.isoWeekday();
    const value = log[props.selectedField]; // selectedField에 따라 값 선택
    days[weekday - 1] = value;
  });
  return days;
});

const labels = ref(["월", "화", "수", "목", "금", "토", "일"]);
// const weightDatum = healthStore.logs.map((item) => item.weight);
</script>

<template>
  <v-card class="chart">
    <v-sparkline
      :model-value="weeklyData"
      :auto-line-width="true"
      :gradient="['#3BBEFF', '#ffffff']"
      :gradient-direction="top"
      fill
      :line-width="2"
      :lineCap="round"
      :smooth="true"
      :radius="10"
      :padding="8"
      :stroke-linecap="lineCap"
      :type="trend"
      auto-draw
      :labels="labels"
    ></v-sparkline>
  </v-card>
</template>

<style lang="scss" scoped>
.chart {
  display: flex;
  height: 350px;
}
.week-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
  font-size: 12px;
  color: #aaa;
}
.week-labels .selected {
  color: #3bbeff;
  font-weight: 600;
}
</style>
