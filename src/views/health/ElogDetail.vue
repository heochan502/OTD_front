<script setup></script>

<template>
  <main>
    <!-- 메인상단 -->
    <div class="main_top">
      <div class="exercise_datetime">운동 일자</div>
      <div class="buttons">
        <div>수정</div>
        <div>삭제</div>
      </div>
    </div>
    <!-- 메인 하단 -->
    <div class="main-bottom">
      <div>로고</div>
      <div>운동명</div>
      <div>운동시간</div>
      <div>30분</div>
      <div>활동에너지</div>
      <div>150kcal</div>
      <div>운동강도</div>
      <div>어려움</div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main_top {
  display: flex;
  justify-content: space-between;
  .buttons {
    display: flex;
  }
}
</style>
