<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/counter';
import { logout } from '@/services/member/accountService';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();
const counter = useAccountStore();
const dialog = ref(false); // 모바일 모달 제어

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
</script>

<template>
  <!-- 상단바 컴포넌트 -->
  <header class="breadcrumb">
    <div class="inner m-inner">
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
        <button>
          <img
            class="photo-wrapper"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIwIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA5NUMyMCA4MCA0MCA2NyA2MCA2N0M4MCA2NyAxMDAgODAgMTAwIDk1IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo="
            alt="프로필"
          />
        </button>
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

  <!-- 모바일 햄버거 모달 메뉴 -->
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dense flat color="primary" dark>
        <v-toolbar-title>메뉴</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-list>
        <v-list-item to="/reminder" @click="dialog = false"
          ><v-list-item-title>리마인더</v-list-item-title></v-list-item
        >
        <v-list-item to="/meal" @click="dialog = false"
          ><v-list-item-title>식단</v-list-item-title></v-list-item
        >
        <v-list-item to="/health" @click="dialog = false"
          ><v-list-item-title>건강</v-list-item-title></v-list-item
        >
        <v-list-item to="/memoAndDiary" @click="dialog = false"
          ><v-list-item-title>기록</v-list-item-title></v-list-item
        >
        <v-list-item to="/community" @click="dialog = false"
          ><v-list-item-title>커뮤니티</v-list-item-title></v-list-item
        >
      </v-list>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
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
.photo-wrapper {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
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
  }
}
.photo-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e2e8f0;
  transition: border-color 0.3s ease;
  size: 15px;
}
@media (max-width: 976px) {
  .inner {
    margin: 18px;
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
</style>
