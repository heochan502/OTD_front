<script setup>
import { computed, onMounted, ref } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import { useExerciseStore } from "@/stores/exerciseStore";
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
  Filler,
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
  LinearScale,
  Filler
);

const props = defineProps({
  selectedDate: {
    type: String,
    required: true,
  },
  selectedField: String,
  fields: Array,
  label: String,
  logs: { type: Array, default: () => [] },
});

const healthStore = useHealthStore();
const exerciseStore = useExerciseStore();

onMounted(async () => {
  await healthStore.fetchHealthlogs();
  await exerciseStore.fetchExerciselogs();
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
// const weeklyLogs = computed(() => {
//   return healthStore.logs.filter((log) => {
//     const day = dayjs(log.healthlogDatetime);
//     return (
//       day.isAfter(weekRange.value.start.subtract(1, "day")) &&
//       day.isBefore(weekRange.value.end.add(1, "day"))
//     );
//   });
// });

const weeklyLogs = computed(() => {
  return props.logs.filter((log) => {
    const day = dayjs(log.healthlogDatetime || log.exerciseDatetime);
    return (
      day.isAfter(weekRange.value.start.subtract(1, "day")) &&
      day.isBefore(weekRange.value.end.add(1, "day"))
    );
  });
});

// 건강 차트
// 주차 데이터 매핑 (월~일, 빈 값은 null)
const weeklyData = computed(() => {
  const days = Array(7).fill(0);
  let lastValue = null;

  weeklyLogs.value.forEach((log) => {
    const day = dayjs(log.healthlogDatetime || log.exerciseDatetime);
    const weekday = day.isoWeekday(); // 1=월 ~ 7=일

    const fieldKey = props.label || props.selectedField;
    let value = log[fieldKey];

    if (value != null) {
      days[weekday - 1] = value;
      lastValue = days[weekday - 1];
    } else {
      days[weekday - 1] = lastValue;
    }
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
      data: weeklyData.value,
      borderColor: "#3BBEFF",
      backgroundColor: "rgba(59, 190, 255, 0.2)",
      fill: true,
      pointRadius: 3,
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
      display: false,
    },
    // 툴팁
    tooltip: {
      callbacks: {
        label: (context) => {
          const field = props.fields.find((f) => f.key === props.selectedField);
          const unit = field?.unit || "";
          if (context.parsed.y === 0) {
            return "기록없음";
          }
          return `${context.parsed.y} ${unit}`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    y: {
      type: "linear",
      suggestedMin: 0,
      title: {
        display: false,
      },
      grid: {
        display: false,
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
  width: 100%;
  height: 350px;
  padding: 12px;
}
</style>
