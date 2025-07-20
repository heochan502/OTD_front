<script setup>
import { ref } from "vue";

const healthLogDate = ref(["2025-07-08", "2025-07-09"]);

const exerciseLogDate = ref(["2025-07-08", "2025-07-16"]);

const calendarAttributes = ref([]);
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

const selectedDate = ref(new Date());
function formatYearMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}
</script>

<template>
  <v-card class="pa-6" max-width="400">
    <v-calendar
      is-expanded
      v-model="selectedDate"
      :attributes="calendarAttributes"
      :locale="'ko'"
      style="border: none"
      :show-adjacent-months="false"
    >
      <!-- 타이틀 디자인 수정 -->
      <template #title="{ start, prev, next }">
        <div class="d-flex align-center justify-start">
          <v-btn icon variant="text" @click="prev">
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>
          <div class="text-subtitle-1">
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
    <div class="caption">
      <span class="dot dot-health"></span>
      <span>건강</span>
      <span class="dot dot-exercise"> </span>
      <span>운동</span>
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
.today {
  background-color: #eaeaea;
  width: 25px;
  height: 25px;
  border-radius: 50%;
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
}
</style>
