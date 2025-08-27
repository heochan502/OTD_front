<script setup>
import ReportCard from "@/components/health/ReportCard.vue";
import HealthLogCalendar from "@/components/health/HealthLogCalendar.vue";
import ExercuseLogList from "@/components/health/ExerciseLogList.vue";
import HealthLogList from "@/components/health/HealthLogList.vue";

import { onMounted } from "vue";
</script>

<template>
  <!-- 레이아웃 -->
  <v-container class="container" fluid>
    <!-- 상단 -->
    <v-row class="top" justify="center">
      <!-- 리포트영역 -->
      <v-col class="d-flex justify-center">
        <ReportCard />
      </v-col>
      <!-- 달력 -->
      <v-col class="d-flex justify-center">
        <HealthLogCalendar />
      </v-col>
    </v-row>
    <!-- 하단 -->
    <v-row class="bottom">
      <v-col class="d-flex justify-center">
        <!-- 운동기록목록 -->
        <ExercuseLogList />
      </v-col>
      <!-- <v-col class="d-flex" style="flex: 1"> -->
      <v-col class="d-flex justify-center">
        <!-- 건강기록목록 -->
        <HealthLogList />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  .top,
  .bottom {
    display: flex;
    justify-content: center;
  }
}
</style>
