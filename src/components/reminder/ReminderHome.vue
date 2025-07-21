<script setup>
import Calendar from '@/components/reminder/Calendar.vue';

const today = new Date();

const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();
</script>

<template>
  <div class="reminder">
    <Calendar></Calendar>
    <div class="list">
      <div><router-link to="/reminderadd">일정 추가하기</router-link></div>
      <div>
        <span class="list_title">오늘의 일정</span>
        <br />
        <span class="list_date"
          >{{ todayYear }}년 {{ todayMonth }}월 {{ todayDate }}일</span
        >
      </div>
      <div>
        <!-- 일정리스트 -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
