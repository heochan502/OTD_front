<script setup></script>

<template>
  <div>
    <div>
      <v-calendar> </v-calendar>
    </div>
    <div class="reminder">
      <div class="btn">
        <router-link to="/reminderadd">일정 추가하기</router-link>
      </div>
      <div class="list">
        <div>
          <div class="title">
            <b>오늘의 일정</b>
          </div>
          <div class="date">
            <span>{{}}년 {{}}월 {{}}일</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
