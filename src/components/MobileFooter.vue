<script setup>
const BASE_URL = '/image/mobile';
</script>

<template>
  <footer class="mobile-footer">
    <nav class="nav-icon">
      <router-link to="/reminder" class="nav-item" v-slot="{ isActive }">
        <img
          :src="
            isActive
              ? `${BASE_URL}/select-calendar.png`
              : `${BASE_URL}/calendar.png`
          "
          alt="리마인더"
        />
        <span>리마인더</span>
      </router-link>

      <router-link to="/meal" class="nav-item" v-slot="{ isActive }">
        <img
          :src="
            $route.path.startsWith(`/meal`)  ? `${BASE_URL}/select-food.png` : `${BASE_URL}/food.png`
          "
          alt="식단"
        />
        <span :class="{ 'active-text': $route.path.startsWith(`/meal`) }"   >식단 </span>
      </router-link>

      <router-link to="/health" class="nav-item" v-slot="{ isActive }">
        <img
          :src="
             $route.path.startsWith(`/health`) 
              ? `${BASE_URL}/select-health.png`
              : `${BASE_URL}/health.png`
          "
          alt="건강"
        />
        <span :class="{ 'active-text': $route.path.startsWith(`/health`) }">건강</span>
      </router-link>

      <router-link to="/community" class="nav-item" v-slot="{ isActive }">
        <img
          :src="
            isActive
              ? `${BASE_URL}/select-community.png`
              : `${BASE_URL}/community.png`
          "
          alt="커뮤니티"
        />
        <span>커뮤니티</span>
      </router-link>
    </nav>
  </footer>
</template>

<style lang="scss" scoped>
.mobile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #ddd;
  z-index: 1000;
  :hover {
    background-color: #fff;
    cursor: pointer;
    :active {
      background-color: #fff;
    }
  }
}

.nav-icon {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  flex: 1;
  bottom: 0;
  border-right: 1px solid #ddd;
  text-decoration: none;
  color: #333;
}

.nav-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

/* 현재 선택된 메뉴 강조 */
.nav-item.router-link-active span,
.active-text {
  color: #4fc3f7;
  font-weight: bold;
}

// vuetify 설정이 안되어 임의로 설정
@media (min-width: 769px) {
  .d-md-flex {
    display: flex !important;
  }
  .d-md-none {
    display: none !important;
  }
}
</style>
