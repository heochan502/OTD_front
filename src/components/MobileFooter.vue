<script setup></script>

<template>
  <footer class="mobile-footer">
    <nav class="nav-icon">
      <router-link to="/reminder" class="nav-item">
        <img src="/image/mobile/calendar.png" alt="리마인더" />
        <span>리마인더</span>
      </router-link>

      <router-link to="/meal" class="nav-item">
        <img src="/image/mobile/food.png" alt="식단" />
        <span>식단</span>
      </router-link>

      <router-link to="/health" class="nav-item">
        <img src="/image/mobile/health.png" alt="건강" />
        <span>건강</span>
      </router-link>

      <router-link to="/community" class="nav-item">
        <img src="/image/mobile/community.png" alt="커뮤니티" />
        <span>커뮤니티</span>
      </router-link>
    </nav>
  </footer>
</template>

<style scoped>
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
      background-color: #4fc3f7;
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
.nav-item.router-link-active span {
  color: #4fc3f7;
  font-weight: bold;
}
</style>
