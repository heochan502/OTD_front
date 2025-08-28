<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/counter';
import { logout } from '@/services/member/accountService';
import { onMounted, ref } from 'vue';
import MobileFooter from '@/components/MobileFooter.vue';
import { getNickName } from '@/services/weather/weatherHomeService';

const router = useRouter();
const route = useRoute();
const counter = useAccountStore();
const toggle = ref(false);
const birthDate = ref('');

function goHome() {
  router.push({ name: 'home' });
}

const today = new Date();
const todayDate = new Date(today.toDateString());

const userCreatedAt = async () => {
  const res = await getNickName();

  const createdAt = new Date(res.data.birthDate);
  const joinDate = new Date(createdAt.toDateString());

  const millisecond = todayDate - joinDate;
  const date = millisecond / (1000 * 60 * 60 * 24);
  birthDate.value = date;
};

const logoutAccount = async () => {
  if (!confirm('로그아웃 하시겠습니까?')) return;
  const res = await logout();
  if (res === undefined || res.status !== 200) return;
  counter.setLoggedIn(false);
  router.push('/login');
};
onMounted(async () => {
  await userCreatedAt();
});
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
      <!-- 모바일 헤더 중앙 -->
      <div class="birth-date d-flex d-md-none">
        원투데이와 {{ birthDate }}일째 친구에요!
      </div>
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
  <div class="d-md-none">
    <MobileFooter class="d-md-none" />
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
  padding: 16px 22px 0px;
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
  gap: 18px;
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
.birth-date {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  color: #838383;
}
@media (max-width: 1080px) {
  .inner {
    padding: 16px 32px 0px;
    .nav {
      gap: 12px;
      padding: 0 20px;
    }
    .member {
      padding: 0 0 0 20px;
    }
    .logo {
      padding: 0 20px 0 20px;
    }
  }
}
@media (max-width: 976px) {
  .inner {
    .logo {
      padding: 0 10px 0 18px;
    }
    .nav {
      padding: 0 10px;
    }
    .member {
      padding: 0 20px 0 10px;
    }
  }
}
@media (max-width: 959px) {
  .photo-wrapper {
    right: 45px;
    transform: translateY(-50%);
  }
  .nav-menu {
    padding: 8px !important;
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
@media (max-width: 874px) {
  .nav {
    font-size: 16px;
    gap: 0 !important;
  }
  .nav-menu {
    padding: 8px !important;
  }
}
@media (max-width: 794px) {
}
@media (max-width: 794px) {
  .inner {
    padding: 16px 34px;
    .member {
      padding: 0 14px 0 10px;
    }
  }
  .auth {
    font-size: 12px;
    gap: 0 !important;
  }
}
@media (max-width: 768px) {
  .inner {
    .logo {
      padding: 0 10px 0 19px;
    }
    .nav {
      padding: 0 4px;
    }
    .member {
      padding: 0 0 0 0.2rem;
    }
  }
}
// vuetify 설정이 안되어 임의로 설정
@media (min-width: 480px) {
  .d-sm-flex {
    display: flex !important;
  }
  .d-sm-none {
    display: none !important;
  }
}
@media (min-width: 769px) {
  .d-md-flex {
    display: flex !important;
  }
  .d-md-none {
    display: none !important;
  }
}
@media (min-width: 1024px) {
  .d-lg-flex {
    display: flex !important;
  }
  .d-lg-none {
    display: none !important;
  }
}
</style>
