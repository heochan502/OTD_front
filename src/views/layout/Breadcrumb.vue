<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push({ name: 'home' }); // 라우트에 name 설정이 되어 있어야 함
}
</script>

<template>
  <!-- 상단바 컴포넌트 -->
  <div class="breadcrumb">
    <div class="inner">
      <!-- 왼쪽 로고 -->
      <div class="logo" @click="goHome" style="cursor: pointer">
        <div>
          <span class="logo-one">One</span>
          <span class="logo-today">ToDay</span>
        </div>
        <div class="logo-sub">하루이틀</div>
      </div>

      <!-- 가운데 메뉴 -->
      <nav class="nav">
        <a href="#">홈</a>
        <router-link to="/reminder" href="#">리마인더</router-link>
        <router-link to="/routine" href="#">루틴</router-link>
        <router-link to="/meal" href="#">식단</router-link>
        <a href="#">건강</a>
        <a href="#">일기</a>
        <a href="#">위치</a>
        <router-link to="/community" href="#">커뮤니티</router-link>
      </nav>

      <!-- 오른쪽 로그인 -->
      <div class="auth">
        <a href="#">로그인</a>
        <a href="#">회원가입</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb {
  width: 100%;
  margin: 0;
  border-bottom: 1px solid #ddd;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  padding: 0 110px 0 0;
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-one {
  font-size: 25px;
  font-weight: bold;
  color: #555;
}

.logo-today {
  font-size: 25px;
  font-weight: bold;
  color: #4fc3f7;
  margin-left: 4px;
}

.logo-sub {
  font-size: 15px;
  color: #999;
  margin-top: -2px;
}

.nav {
  padding: 0 60px 0 120px;
  display: flex;
  gap: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #222;
}

.nav .active {
  font-weight: bold;
}

.auth {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #444;
}
</style>
