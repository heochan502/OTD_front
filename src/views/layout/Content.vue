<script setup>

</script>

<template>
  <main class="content">
    <div class="box">
      <!-- 콘텐츠 표시할 영역 -->
      <!-- 본인이 구현할 Breadcumb 항목에 클릭이벤트 생성한 후에  -->
      <!-- 라우터 설정해서 이곳에 본인 화면을 나타내면 됩니다. -->
      <router-view />
    </div>
  </main>
</template>

<style scoped>
.content {
  min-width: 100vh;
  min-height: 100vh;
  flex: 1;
  padding: 40px 32px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  min-width: 100vh;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  height: 400px;
  background-color: #ccc;
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
