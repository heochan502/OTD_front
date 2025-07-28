<template>
  <div class="memo-menu">
    <h2>기록을 시작해볼까요?</h2>
    <div class="button-wrapper">
      <button @click="goToMemo">📝 메모 등록</button>
      <button @click="goToDiary">📔 다이어리 등록</button>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMemo = () => {
router.push({ name: 'MemoDetail' });
};

const goToDiary = () => {
router.push({ name: 'DiaryDetail' });
};
</script>

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