<script setup>
import HealthReportCard from "@/components/health/HealthReportCard.vue";
import HealthLogCalendar from "@/components/health/HealthLogCalendar.vue";
import ExercuseLogList from "@/components/health/ExercuseLogList.vue";
import HealthLogList from "@/components/health/HealthLogList.vue";
</script>

<template>
  <!-- 레이아웃 -->
  <div class="container">
    <main>
      <!-- 상단 -->
      <div class="main_top">
        <!-- 리포트영역 -->
        <div class="report">
          <HealthReportCard />
        </div>
        <!-- 달력 -->
        <HealthLogCalendar />
      </div>
      <!-- 하단 -->
      <div class="main_bottom">
        <div class="log_list">
          <div class="exerciselog_list">
            <!-- 운동기록목록 -->
            <ExercuseLogList />
          </div>
          <div class="healthlog_list">
            <!-- 건강기록목록 -->
            <HealthLogList />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main_top {
  display: flex;
  justify-content: space-between;

  .card {
    justify-content: center;
    width: 380px;
  }
}

.log_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
</style>
