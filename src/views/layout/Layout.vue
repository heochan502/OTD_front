<script setup>
import Breadcrumb from './Breadcrumb.vue';
import Content from './Content.vue';
</script>

<template>
  <!-- 레이아웃을 통일해서 재사용할 컴포넌트를 보여줌 -->
  <div class="layout">
    <!-- 스크롤시 상단바가 화면에 딸려 내려오는 기능 구현할 예정 -->
    <hearder class="headerlayout">
      <Breadcrumb />
    </hearder>
    <main class="contentlayout">
      <Content />
    </main>
  </div>
</template>

<style scoped>
.headerlayout {
  min-width: 90vw;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.contentlayout {
  min-width: 100vw;
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
}
</style>
