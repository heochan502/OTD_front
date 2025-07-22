<script setup>
import { reactive } from 'vue';

const state = reactive({
  reminder: [],
});
</script>
<template>
  <div>
    <div>
      <router-link to="/reminderform">일정 추가하기</router-link>
    </div>
    <ul class="remider">
      <template v-for="item in state.reminder">
        <li>
          <span class="title">{{ item.title }}</span>
          <!-- 이미지 -->
          <span class="date">{{ item.date }}</span>
          <!-- 알람 -->
          <img
            v-if="state.reminder.content"
            src="/src/image/button.png"
            alt="상세보기"
          />
        </li>
        <img src="/src/image/delete.png" alt="삭제" />
        <router-link to="reminderform>"
          ><img src="/src/image/modify.png" alt="수정"
        /></router-link>
      </template>
    </ul>
  </div>
</template>
<style></style>
