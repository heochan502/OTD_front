<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}`;
}

const goToMemo = () => {
  router.push('/memoAndDiary/memo');
};
const goToDiary = () => {
  router.push('/memoAndDiary/diary');
};
</script>

<template>
  <div class="memo-menu">
    <h2>기록을 시작해볼까요?</h2>
    <div class="button-wrapper">
      <button @click="goToMemo">📝 메모</button>
      <button @click="goToDiary">📔 다이어리</button>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.memo-menu {
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  text-align: center;
}
.button-wrapper {
  display: flex;
  gap: 40px;
  margin-top: 50px;
}
button {
  width: 240px;
  height: 80px;
  padding: 20px 32px;
  font-size: 22px;
  font-weight: bold;
  border-radius: 16px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
button:hover {
  background-color: #d9d9d9;
}
</style>