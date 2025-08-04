<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const isRootMenu = computed(() => route.path.startsWith('/memoAndDiary') && route.matched.length === 1);

const goToMemo = () => {
  router.push('/memoAndDiary/memo/list');
};

const goToDiary = () => {
  router.push('/memoAndDiary/diary/list');
};
</script>

<template>
  <div class="memo-and-diary">
    <div v-if="isRootMenu" class="menu-section">
      <h2>기록을 시작해볼까요?</h2>
      <div class="button-wrapper">
        <button @click="goToMemo" aria-label="메모 목록으로 이동">📝 메모</button>
        <button @click="goToDiary" aria-label="다이어리 목록으로 이동">📔 다이어리</button>
      </div>
    </div>

    <!-- 자식 라우트 렌더링 -->
    <router-view />
  </div>
</template>

<style scoped>
.memo-and-diary {
  color: #000;
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  padding-bottom: 80px;
}

.menu-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
  text-align: center;
}

.menu-section h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.button-wrapper {
  display: flex;
  gap: 40px;
}

button {
  color: #000;
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

button:active {
  transform: scale(0.98);
}
</style>