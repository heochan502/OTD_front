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
    :deep(.v-card-text) {
      // width: 50%;
      padding: 10 0 !important;
    }
  }
}
@media (max-width: 701px) {
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
    padding: 0 1rem;
    :deep(.v-card) {
      width: 100% !important;
      margin: 0 !important;
      box-sizing: border-box;
    }
    :deep(.health_report) {
      margin: 0 !important;
      gap: 0 !important;
    }
  }
}
@media (max-width: 400px) {
  .report-wrapper {
    padding: 0 !important;

    :deep(.v-card) {
      width: calc(100% - 2rem) !important;
      margin: 0 auto !important;
      box-sizing: border-box;
      min-width: 90% !important;
    }

    :deep(.v-card-text) {
      padding: 0.6rem !important; // ✅ 내부 패딩도 축소
    }
  }
}
</style>
