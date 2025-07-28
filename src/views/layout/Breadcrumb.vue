<script setup>
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/counter';
import { logout } from '@/services/accountService';

const router = useRouter();
const counter = useAccountStore();

function goHome() {
  router.push({ name: 'home' }); // 라우트에 name 설정이 되어 있어야 함
}

const logoutAccount = async () => {
  if (!confirm('로그아웃 하시겠습니까?')) {
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
  <header class="breadcrumb">
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
        <router-link to="/" class="nav-menu" active-class="active"
          >홈</router-link
        >
        <router-link
          to="/reminder"
          href="#"
          class="nav-menu"
          active-class="active"
          >리마인더</router-link
        >
        <router-link to="/meal" href="#" class="nav-menu" active-class="active"
          >식단</router-link
        >
        <router-link
          to="/health"
          href="#"
          class="nav-menu"
          active-class="active"
          >건강</router-link
        >
        <router-link to="/memo-And-Diary" href="#" class="nav-menu" active-class="active"
          >일기</router-link
        >
        <router-link
          to="/community"
          href="#"
          class="nav-menu"
          active-class="active"
          >커뮤니티</router-link
        >
      </nav>

      <!-- 오른쪽 로그인 -->
      <div class="member">
        <div class="auth">
          <template v-if="counter.state.loggedIn">
            <a class="auth" @click="logoutAccount">로그아웃</a>
            <router-link to="/profile" class="auth">회원정보</router-link>
          </template>
          <template v-else>
            <router-link to="/login" href="#" class="auth">로그인</router-link>
            <router-link to="/signup" href="#" class="auth"
              >회원가입</router-link
            >
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.breadcrumb {
  width: 100%;
  background-color: white;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 32px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
}

.logo {
  padding: 0 70px 0 0;
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-one {
  // font-size: 20px;
  font-weight: bold;
  color: #838383;
}

.logo-today {
  // font-size: 20px;
  font-weight: bold;
  color: #4fc3f7;
  margin-left: 4px;
}

.logo-sub {
  font-size: 12px;
  color: #999;
  margin-top: -2px;
  margin-left: 86px;
}

.nav {
  padding: 0 70px;
  display: flex;
  gap: 20px;
  font-size: 18px;
  color: #222;
  .nav-menu {
    color: black;
    padding: 10px;
    font-weight: bold;
    &:hover {
      background-color: white;
      font-weight: bold;
      color: #4fc3f7;
    }
  }
}

.nav .active {
  font-weight: bold;
  color: #4fc3f7;
}

.member {
  padding: 0 0 0 70px;
}
.auth {
  display: flex;
  gap: 12px;
  font-size: 16px;
  color: black;
  cursor: pointer;
  &:hover {
    background-color: white;
  }
}
</style>
