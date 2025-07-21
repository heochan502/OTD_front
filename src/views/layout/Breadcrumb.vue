<script setup>
import { useRouter } from "vue-router";

import { useAccountStore } from "@/stores/counter";
import { logout } from "@/services/accountService";

const router = useRouter();
const counter = useAccountStore();

function goHome() {
  router.push({ name: "home" }); // 라우트에 name 설정이 되어 있어야 함
}

const logoutAccount = async () => {
  if (!confirm("로그아웃 하시겠습니까?")) {
    return;
  }
  const res = await logout();
  if (res === undefined || res.status !== 200) {
    return;
  }
  counter.setLoggedIn(false);
};
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
        <router-link to="/health" href="#">건강</router-link>
        <a href="#">일기</a>
        <a href="#">위치</a>
        <router-link to="/community" href="#">커뮤니티</router-link>
      </nav>

      <!-- 오른쪽 로그인 -->
      <div class="auth">
        <template v-if="counter.state.loggedIn">
          <a @click="logoutAccount">로그아웃</a>
          <router-link to="/profile">회원정보</router-link>
        </template>
        <template v-else>
          <router-link to="/login" href="#">로그인</router-link>
          <router-link to="/signup" href="#">회원가입</router-link>
        </template>
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
