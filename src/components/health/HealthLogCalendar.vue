<script setup>
import { onMounted, ref, reactive } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import { useExerciseStore } from "@/stores/exerciseStore";

const healthStore = useHealthStore();
const exerciseStore = useExerciseStore();

const healthLogDate = ref([]);
const exerciseLogDate = ref([]);

const calendarAttributes = ref([]);

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const selectedDate = ref(new Date());

function formatYearMonth(date) {
  // if (!date) return "";
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

onMounted(async () => {
  await healthStore.fetchHealthlogs();
  await exerciseStore.fetchExerciselogs();

  healthLogDate.value = healthStore.logs.map((item) =>
    formatDate(item.healthlogDatetime)
  );

  exerciseLogDate.value = exerciseStore.logs.map((item) =>
    formatDate(item.exerciseDatetime)
  );
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
    <v-calendar
      is-expanded
      v-model="selectedDate"
      :attributes="calendarAttributes"
      :locale="'ko'"
      :show-adjacent-months="false"
      style="width: 100%; height: 100%; border: none"
      class="calendar"
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
            <span
              v-if="healthLogDate.includes(formatDate(day.date))"
              class="dot dot-health"
            ></span>
            <span
              v-if="exerciseLogDate.includes(formatDate(day.date))"
              class="dot dot-exercise"
            ></span>
          </div>
        </div>
      </template>
    </v-calendar>
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
