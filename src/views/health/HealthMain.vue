<script setup>
import HealthReportCard from "@/components/health/HealthReportCard.vue";
import HealthLogCalendar from "@/components/health/HealthLogCalendar.vue";
import ExercuseLogList from "@/components/health/ExercuseLogList.vue";
import HealthLogList from "@/components/health/HealthLogList.vue";

import { onMounted } from "vue";
</script>

<template>
  <!-- 레이아웃 -->
  <v-container class="container" fluid>
    <!-- 상단 -->
    <v-row class="top" justify="center" align="center">
      <!-- 리포트영역 -->
      <v-col cols="auto">
        <HealthReportCard />
      </v-col>
      <!-- 달력 -->
      <v-col cols="auto">
        <HealthLogCalendar />
      </v-col>
    </v-row>
    <!-- 하단 -->
    <v-row class="bottom">
      <v-col cols="auto">
        <!-- 운동기록목록 -->
        <ExercuseLogList />
      </v-col>
      <v-col cols="auto">
        <!-- 건강기록목록 -->
        <HealthLogList />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-content: center;

  .top,
  .bottom {
    display: flex;
    justify-content: center;
  }

  .top {
    margin-bottom: 50px;
  }
}
</style>
