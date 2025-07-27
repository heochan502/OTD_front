<template>
  <div class="memo-menu">
    <h2>기록을 시작해볼까요?</h2>
    <div class="button-wrapper">
      <button @click="goToMemo">📝 메모 등록</button>
      <button @click="goToDiary">📔 다이어리 등록</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMemo = () => {
  router.push('/memo/list');
};

const goToDiary = () => {
  router.push('/diary/add');
};
</script>

<style scoped>
.memo-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  text-align: center;
}
.button-wrapper {
  display: flex;
  gap: 24px;
  margin-top: 30px;
}
button {
  padding: 16px 32px;
  font-size: 18px;
  border-radius: 12px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: 0.2s;
}
button:hover {
  background-color: #d9d9d9;
}
</style>