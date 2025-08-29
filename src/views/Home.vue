<script setup>
import Weather from "@/views/weather/weather.vue";
import ReportCard from "@/components/health/ReportCard.vue";
import ReminderHome from "@/components/reminder/HomeReminder.vue";
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
}
.weather-layout {
  max-width: 1200px;
  margin: 0 auto;
}
.reminder-wrapper {
  width: 50%;
  :deep(.empty-wrapper) {
    min-height: 250px;
  }
}

.report-wrapper {
  width: 50%;

  :deep(.v-card) {
    background-color: transparent !important;
    width: 97%;
    min-height: 448px;
    margin: 0 1rem 1rem 0;
  }

  :deep(.v-card-text) {
    background-color: #fff;
    padding: 1rem !important;
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
    min-height: 350px;
    margin: 0 auto !important;
    gap: 1rem;
    padding-top: 1rem;
    user-select: none;
  }
}
@media (max-width: 945px) {
  .report-wrapper {
    :deep(.health_report) {
    }
    :deep(.exercise_report) {
    }
    :deep(.v-card-text) {
      // width: 50%;
      padding: 10 0 !important;
    }
  }
}
@media (max-width: 522px) {
  .home-layout {
    flex-direction: column;
  }
  .reminder-wrapper {
    width: 100%;
    :deep(.reminder) {
      // border-radius: 0 25px 25px;
      border-radius: 0 0 25px 25px;
    }
    :deep(.list-title) {
      width: 100%;
    }
    :deep(.empty-wrapper) {
      min-height: 200px;
    }
  }
  .report-wrapper {
    width: 100%;
    :deep(.v-card) {
      // margin: 0 1rem 0 1rem;
      width: 93%;
      margin-left: 1rem;
      margin-bottom: 5rem;
      border-radius: 25px;
    }
  }
}
</style>
