<script setup>
import Weather from '@/views/weather/weather.vue';
import ReportCard from '@/components/health/ReportCard.vue';
import ReminderHome from '@/components/reminder/HomeReminder.vue';
</script>

<template>
  <Weather class="weather-layout" />
  <div class="home-layout">
    <div class="reminder-wrapper mt-6">
      <ReminderHome />
    </div>
    <div class="report-wrapper mt-10">
      <ReportCard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.weather-layout {
  max-width: 1200px;
  margin: 0 auto;
}
.reminder-wrapper,
.report-wrapper {
  width: 50%;
}

.report-wrapper {
  :deep(.v-card) {
    background-color: transparent !important;
    border-radius: 25px 25px 0 0 !important;
    width: 96%;
    min-height: 448px;
  }

  :deep(.v-card-text) {
    background-color: #fff;
    padding: 1rem !important;
    max-height: 400px !important;
    min-height: 400px !important;
  }
  :deep(.v-tab) {
    font-size: 1rem !important;
    font-weight: 700 !important;
    color: #fff !important;
    text-transform: none !important;
  }
  :deep(.exercise_report) {
    min-height: 300px;
    user-select: none;
  }
  :deep(.health_report) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    min-height: 350px;
    margin: 0 auto !important;
    padding-top: 1rem;
    user-select: none;
  }
}
</style>
