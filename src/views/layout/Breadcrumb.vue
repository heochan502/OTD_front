<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/counter';
import { logout } from '@/services/member/accountService';
import { ref } from 'vue';
import MobileFooter from '@/components/MobileFooter.vue';
import { useReminderStore } from '@/stores/reminderStore';

const router = useRouter();
const route = useRoute();
const counter = useAccountStore();
const toggle = ref(false);
const reminderStore = useReminderStore();

function goHome() {
  router.push({ name: 'home' });
}

const logoutAccount = async () => {
  if (!confirm('로그아웃 하시겠습니까?')) return;
  const res = await logout();
  if (res === undefined || res.status !== 200) return;
  counter.setLoggedIn(false);
  router.push('/login');
};

const formatNumber = (n) => String(n).padStart(2, '0');
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = formatNumber(date.getMonth() + 1);
  const d = formatNumber(date.getDate());
  return `${y}-${m}-${d}`;
};

const resetDate = () => {
  const today = new Date();
  reminderStore.setCurrentYear(today.getFullYear());
  reminderStore.setCurrentMonth(today.getMonth() + 1);
  reminderStore.setSelectedDate(formatDate(today));
};

</script>

<template>
  <!-- 상단바 컴포넌트 -->
  <header class="breadcrumb">
    <div class="inner">
      <!-- 왼쪽 로고 (모바일 화면용) -->
      <div class="logo" @click="goHome" style="cursor: pointer">
        <div>
          <span class="logo-one">One</span>
          <span class="logo-today">ToDay</span>
        </div>
        <div class="logo-sub">하루이틀</div>
      </div>

      <!-- 오른쪽 사용자 메뉴(모바일 화면용) -->
      <div class="d-flex flex-row d-md-none">
        <button class="photo-wrapper" @click="toggle = !toggle">
          <img
            class="profile"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIwIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA5NUMyMCA4MCA0MCA2NyA2MCA2N0M4MCA2NyAxMDAgODAgMTAwIDk1IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo="
            alt="프로필사진"
          />
        </button>

        <!-- 토글된 멤버 메뉴 (모바일용) -->
        <div v-if="toggle" class="mobile-member">
          <template v-if="counter.state.loggedIn">
            <a class="mobile-auth" @click="logoutAccount">로그아웃</a>
            <router-link to="/profile" class="mobile-auth"
              >회원정보</router-link
            >
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-auth">로그인</router-link>
            <router-link to="/signup" class="mobile-auth">회원가입</router-link>
          </template>
        </div>
      </div>

      <!-- PC 전용 메뉴 -->
      <nav class="nav d-none d-md-flex">
        <router-link to="/" class="nav-menu" active-class="active"
          >홈</router-link
        >
        <router-link
          to="/reminder"
          class="nav-menu"
          :class="{ active: route.path.startsWith('/reminder') }"
          @click="resetDate"
          >리마인더</router-link
        >
        <router-link
          to="/meal"
          class="nav-menu"
          :class="{ active: route.path.startsWith('/meal') }"
          >식단</router-link
        >
        <router-link
          to="/health"
          class="nav-menu"
          :class="{
            active:
              route.path.startsWith('/elog') || route.path.startsWith('/hlog'),
          }"
          >건강</router-link
        >
        <router-link
          to="/memoAndDiary"
          class="nav-menu"
          :class="{ active: route.path.startsWith('/memoAndDiary') }"
          >기록</router-link
        >
        <router-link
          to="/community"
          class="nav-menu"
          :class="{ active: route.path.startsWith('/community') }"
          >커뮤니티</router-link
        >
        <router-link
          to="/navermaps"
          href="#"
          class="nav-menu"
          :class="{ active: route.path.startsWith('/navermaps') }"
          >지도</router-link
        >
      </nav>
      <!-- 오른쪽 로그인 (PC 전용) -->
      <div class="member d-none d-md-flex">
        <div class="auth">
          <template v-if="counter.state.loggedIn">
            <a class="auth" @click="logoutAccount">로그아웃</a>
            <router-link to="/profile" class="auth">회원정보</router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="auth">로그인</router-link>
            <router-link to="/signup" class="auth">회원가입</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
  <div class="d-lg-none">
    <MobileFooter />
  </div>
</template>

<style lang="scss" scoped>
.breadcrumb {
  width: 100%;
  background-color: white;
}
.inner {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px 32px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
}
.logo {
  padding: 0 40px 0 0;
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
  padding: 0 40px;
  display: flex;
  gap: 24px;
  font-size: 16px;
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
  padding: 0 0 0 40px;
}
.auth {
  display: flex;
  gap: 12px;
  font-size: 16px;
  color: black;
  cursor: pointer;
  &:hover {
    background-color: white;
    font-weight: bold;
  }
}
.mobile-member {
  position: absolute;
  top: 70px;
  right: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
.mobile-auth {
  font-size: 16px;
  color: black;
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
}
.photo-wrapper {
  position: absolute;
  width: 40px;
  height: 40px;
  overflow: hidden;
}
@media (max-width: 976px) {
  .inner {
    .logo {
      padding: 0 10px 0 0;
    }
    .nav {
      padding: 0 10px;
    }
    .member {
      padding: 0 0 0 10px;
    }
  }
}
@media (max-width: 959px) {
  .photo-wrapper {
    right: 32px;
    transform: translateY(-50%);
  }
  .profile {
    display: inline-block;
    overflow: hidden;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #ecf0f1;
    vertical-align: top;
  }
}
</style>
