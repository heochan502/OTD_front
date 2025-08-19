<script setup>
import { computed, onMounted, ref } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

// Chart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "vue-chartjs";

dayjs.extend(isoWeek);

// Chart.js 기본 세팅
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  selectedDate: {
    type: String,
    required: true,
  },
  selectedField: String, // weight, sleep, exercise 등
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

// 주차 데이터 필터링
const weeklyLogs = computed(() => {
  return healthStore.logs.filter((log) => {
    const day = dayjs(log.healthlogDatetime);
    return (
      day.isAfter(weekRange.value.start.subtract(1, "day")) &&
      day.isBefore(weekRange.value.end.add(1, "day"))
    );
  });
});

// 주차 데이터 매핑 (월~일, 빈 값은 null)
const weeklyData = computed(() => {
  const days = Array(7).fill(null);
  weeklyLogs.value.forEach((log) => {
    const day = dayjs(log.healthlogDatetime);
    const weekday = day.isoWeekday(); // 1=월 ~ 7=일
    const value = log[props.selectedField];
    days[weekday - 1] = value;
  });
  return days;
});

// X축 라벨 (월 ~ 일)
const labels = ref(["월", "화", "수", "목", "금", "토", "일"]);

// Chart.js 데이터셋
const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: props.selectedField || "데이터",
      data: weeklyData.value,
      borderColor: "#3BBEFF",
      backgroundColor: "rgba(59,190,255,0.2)",
      tension: 0.3,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: "#3BBEFF",
    },
  ],
}));

// Chart.js 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#333",
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} ${props.selectedField}`,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "요일",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: props.selectedField,
      },
    },
  },
};
</script>

<template>
  <v-card class="chart">
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<style lang="scss" scoped>
.chart {
  display: flex;
  height: 350px;
  padding: 12px;
}
</style>
