<script setup>
import { onMounted, ref, computed, reactive, onUnmounted } from "vue";
import { getEexerciselogCalendar } from "@/services/health/elogService";
import { getHealthlogCalendar } from "@/services/health/hlogService";
import { end } from "@popperjs/core";
import { useExerciseStore } from "@/stores/exerciseStore";
import { useHealthStore } from "@/stores/healthStore";

const exerciseStore = useExerciseStore();
const healthStore = useHealthStore();

const healthLogDate = ref([]);
const exerciseLogDate = ref([]);
const calendarAttributes = ref([]);

// 오늘날짜
const selectedDate = ref(new Date());

// 달력 title 날짜
function formatYearMonth(date) {
  // if (!date) return "";
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}
// 날짜 형변환
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const params = reactive({
  start: null,
  end: null,
});

const getData = async (params) => {
  const res = await getEexerciselogCalendar(params);
  const res2 = await getHealthlogCalendar(params);

  if (res.status === 200 && res2.status === 200) {
    const result = res.data;
    const result2 = res2.data;
    console.log("결과", result);
    exerciseStore.addCalendarDate(
      result.map((item) => formatDate(item.exerciseDatetime))
    );
    healthStore.addCalendarDate(
      result2.map((item) => formatDate(item.healthlogDatetime))
    );
  }
};

// 달력 이동 시 실행되는 함수
const onDidMove = async (pages) => {
  exerciseStore.clearCalendarDate();
  // 현재 보여지는 달력의 첫 페이지 정보
  const page = pages[0];
  const year = page.year;
  const month = page.month;
  const start = `${year}-${month}-01`; // 월 시작일
  const end = `${year}-${month}-31`; // 월 마지막일

  params.start = start;
  params.end = end;

  getData(params);
};

const getParamsFromDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const start = `${year}-${month}-01`;
  const end = `${year}-${month}-${new Date(
    year,
    date.getMonth() + 1,
    0
  ).getDate()}`;
  return { start, end };
};

// 날짜 받아오기(원래 코드)
// const getData = async () => {
//   let res = null;
//   res = await getEexerciselogCalendar(params);
//   // console.log("운동기록날짜", res.data);
//   exerciseLogDate.value = res.data.map((item) =>
//     formatDate(item.exerciseDatetime)
//   );

//   res = await getHealthlogCalendar(params);
//   healthLogDate.value = res.data.map((item) =>
//     formatDate(item.healthlogDatetime)
//   );
// };

// 날짜 받아오기(수정된 코드)
// const getData = async (date) => {
//   // params 생성
//   const params = getParamsFromDate(date);
//   console.log("파람즈", date);
//   let res = await getEexerciselogCalendar(params);
//   exerciseLogDate.value = res.data.map((item) =>
//     formatDate(item.exerciseDatetime)
//   );

//   res = await getHealthlogCalendar(params);
//   healthLogDate.value = res.data.map((item) =>
//     formatDate(item.healthlogDatetime)
//   );
// };

// 점 찍을 때 해당 일자에 데이터 있는지 확인하기 위함
const healthLogSet = computed(() => new Set(healthStore.calendarDate));
const exerciseLogSet = computed(() => new Set(exerciseStore.calendarDate));

onMounted(async () => {
  const params = getParamsFromDate(selectedDate.value);
  getData(params);
});
onUnmounted(() => {
  exerciseStore.clearCalendarDate();
  healthStore.clearCalendarDate();
});
</script>

<template>
  <v-card class="calendar_card" width="400" height="300">
    <div class="caption d-flex align-center">
      <span class="dot dot-health"></span>
      <span>건강</span>
      <span class="dot dot-exercise"> </span>
      <span>운동</span>
    </div>
    <vc-calendar
      is-expanded
      v-model="selectedDate"
      :attributes="calendarAttributes"
      :locale="'ko'"
      :show-adjacent-months="false"
      style="width: 100%; height: 100%; border: none"
      class="calendar"
      @did-move="onDidMove"
    >
      <!-- 타이틀 디자인 수정 -->
      <template #title="{ start, prev, next }">
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="prev">
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>
          <div class="text-subtitle-1" v-if="start">
            {{ formatYearMonth(start) }}
          </div>
          <v-btn icon variant="text" @click="next">
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </div>
      </template>
      <!-- 기록일에 점찍기 -->
      <template #day-content="{ day }">
        <div class="text-center">
          <div
            :class="{ today: formatDate(day.date) === formatDate(new Date()) }"
          >
            {{ day.day }}
          </div>
          <div class="dot-wrapper">
            <!-- <span
              v-if="healthLogDate.includes(formatDate(day.date))"
              class="dot dot-health"
            ></span> -->
            <span
              v-if="healthLogSet.has(formatDate(day.date))"
              class="dot dot-health"
            ></span>
            <span
              v-if="exerciseLogSet.has(formatDate(day.date))"
              class="dot dot-exercise"
            ></span>
          </div>
        </div>
      </template>
    </vc-calendar>
  </v-card>
</template>

<style lang="scss" scoped>
.today {
  background-color: #eaeaea;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.dot-wrapper {
  display: flex;

  justify-content: center;
  gap: 4px;
  margin-top: 2px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dot-health {
  background-color: #5cff3b; /* 초록 */
}

.dot-exercise {
  background-color: #3b62ff; /* 파랑 */
}

.caption {
  display: flex;
  justify-content: end;
  gap: 5px;
  align-items: center;
  font-size: 10px;
  margin: 5px 5px 0 0;
}
</style>
