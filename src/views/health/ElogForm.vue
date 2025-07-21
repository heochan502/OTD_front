<script setup>
const exerciseLogs = reactive([
  {
    exerciselog_id: 1,
    exercise: "수영",
    duration: 60,
    healthLog_datetime: "2025-07-08",
  },
  {
    exerciselog_id: 2,
    exercise: "달리기",
    duration: 60,
    date: "2025-07-16",
  },
]);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<template>
  <div class="top">
    <div>
      {{ formatDate(exerciseLogs.healthLog_datetime) }}
    </div>
    <div>수정 삭제</div>
  </div>
  <div class="main">
    <div class="main_left">{{ exerciseLogs.exercise }}</div>
    <div class="main_right"></div>
  </div>
</template>

<style scoped></style>
