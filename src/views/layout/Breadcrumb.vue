
<template>
  <!-- 상단바 컴포넌트 -->
  <header class="breadcrumb">
    <div class="inner">
      <!-- 왼쪽 로고 -->
      <div class="logo">
        <div>
          <span class="logo-one">One</span>
          <span class="logo-today">ToDay</span>
        </div>
        <div class="logo-sub">하루이틀</div>
      </div>

      <!-- 가운데 메뉴 -->
  <nav class="nav">
    <router-link to="/">홈</router-link>
    <router-link to="/reminder">리마인더</router-link>
    <router-link to="/routine">루틴</router-link>
    <router-link to="/diet">식단</router-link>
    <router-link to="/health">건강</router-link>
    <router-link to="/memo">일기</router-link>
    <router-link to="/location">위치</router-link>
    <router-link to="/community">커뮤니티</router-link>
  </nav>

      <!-- 오른쪽 로그인 -->
  <div class="auth">
    <router-link to="/login">로그인</router-link>
    <router-link to="/signup">회원가입</router-link>
  </div>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.breadcrumb {
  width: 100%;
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
  font-size: 20px;
  font-weight: bold;
  color: #555;
}

.logo-today {
  font-size: 20px;
  font-weight: bold;
  color: #4fc3f7;
  margin-left: 4px;
}

.logo-sub {
  font-size: 10px;
  color: #999;
  margin-top: -2px;
}

.nav {
  padding: 0 60px 0 120px;
  display: flex;
  gap: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #222;
}

.nav .active {
  font-weight: bold;
}

.auth {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #444;
}
</style>
