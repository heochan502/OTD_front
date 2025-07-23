<script setup>
import Layout from './views/layout/Layout.vue';
import { useRoute, useRouter } from 'vue-router';
import { watch, onMounted, ref } from 'vue';
import { useAccountStore } from './stores/counter';
import { check } from './services/accountService';

const route = useRoute();
const router = useRouter();
const counter = useAccountStore();

// 초기 로딩 상태 추가
const isInitializing = ref(true);

const checkAccount = async () => {
  console.log('로그인 체크');
  try {
    const res = await check();
    console.log('res:', res);
    
    if (res && res.status === 200 && res.data > 0) {
      // 로그인 상태
      counter.setChecked(true);
      counter.setLoggedIn(true);
      
      // 현재 경로가 login 또는 signup이면 홈으로 리다이렉트
      if (route.path === '/login' || route.path === '/signup') {
        router.push('/');
      }
    } else {
      // 로그아웃 상태
      counter.setChecked(true);
      counter.setLoggedIn(false);
      
      // 보호된 경로에 접근 시 로그인 페이지로 리다이렉트
      const protectedRoutes = ['/profile', '/profile/edit'];
      if (protectedRoutes.includes(route.path)) {
        router.push('/login');
      }
    }
  } catch (error) {
    console.error('로그인 체크 에러:', error);
    counter.setChecked(true);
    counter.setLoggedIn(false);
  } finally {
    isInitializing.value = false;
  }
};

onMounted(async () => {
  // 초기 로딩 시 로그인 체크
  await checkAccount();
});

// 라우트 변경 감지
watch(
  () => route.path,
  () => {
    if (!isInitializing.value) {
      checkAccount();
    }
  }
);
</script>

<template>
  <div class="layout">
    <!-- 초기 로딩 중에는 로딩 표시 -->
    <div v-if="isInitializing" class="loading-container">
      <div class="spinner"></div>
      <p>로딩 중...</p>
    </div>
    <!-- 로딩 완료 후 레이아웃 표시 -->
    <Layout v-else />
  </div>
</template>

<style>
.layout {
  width: 100%;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2a9df4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 16px;
}
</style>