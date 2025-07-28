<script setup></script>

<template>
  <main class="content">
    <div class="box" id="content-box">
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
  padding: 30px 32px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  min-width: 100vh;
  min-height: 100vh;
  width: 100%;
  max-width: 1100px;
  height: 1400px;
  border-radius: 8px;
}
</style>
