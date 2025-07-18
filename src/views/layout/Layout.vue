<template>
  <!-- 레이아웃을 통일해서 재사용할 컴포넌트 -->
  <div class="layout">
    <Breadcrumb />
    <Content />
</div>
</template>

<script setup>
import Breadcrumb from './Breadcrumb.vue';
import Content from './Content.vue';
</script>

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