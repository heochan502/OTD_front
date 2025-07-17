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
.layout {
  min-width: 100vh;
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
}
</style>
