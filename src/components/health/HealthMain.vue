<script setup></script>

<template>
  <!-- 레이아웃 -->
  <div class="container layout">
    <main>
      <!-- 상단 -->
      <div class="main_top">
        <!-- 리포트영역 -->
        <div class="report">
          <div>운동리포트</div>
          <div>건강리포트</div>
        </div>
        <!-- 달력영역 -->
        <div>달력</div>
      </div>
      <!-- 하단 -->
      <div class="main_bottom">
        <!-- 운동기록목록 -->
        <div class="log_list">
          <div class="log_list_top">
            <div class="log_title">운동기록</div>
            <router-link to="/elog/add"
              ><i class="bi bi-plus-circle"></i
            ></router-link>
          </div>
          <div class="health_list_log">운동기록 리스트</div>
        </div>
        <!-- 건강기록목록 -->
        <div class="log_list">
          <div class="log_list_top">
            <div class="log_title">건강기록</div>
            <router-link to="/hlog/add"
              ><i class="bi bi-plus-circle"></i
            ></router-link>
          </div>
          <div class="health_list_log">건강기록 리스트</div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.main_top {
  display: flex;
  justify-content: space-between;

  .report {
    display: flex;
  }
}
.main_bottom {
  display: flex;
  justify-content: space-between;
  .log_list_top {
    display: flex;
    justify-content: space-between;
  }
}
</style>
