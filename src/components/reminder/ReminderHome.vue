<script setup>
import { reactive, onMounted } from 'vue';
import { getByMonth } from '@/services/reminder/reminderService';
import { getByDay } from '@/services/reminder/reminderService';
import Calendar from '@/components/reminder/Calendar.vue';

const today = new Date();

const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();

const state = reactive({ reminderDate: [], todayReminder: [] });

const getDate = async (date) => {
  const res = await getByMonth(date.year, date.month);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  state.reminderDate = res.data;
  console.log('res1', res);
  console.log('res2', state.reminderDate);
};

onMounted(async () => {
  const res = await getByDay(todayYear, todayMonth, todayDate);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  state.reminderDate = res.data;
});
</script>

<template>
  <div class="reminder">
    <div>
      <Calendar @reminder-date="getDate"></Calendar>
    </div>
    <div><router-link to="/reminderform">일정 추가하기</router-link></div>
    <router-link to="/reminderlist" class="list">
      <div>
        <span class="list_title">오늘의 일정</span>
        <br />
        <span class="list_date"
          >{{ todayYear }}년 {{ todayMonth }}월 {{ todayDate }}일</span
        >
        <ul v-if="state.todayReminder">
          <li v-for="item in state.todayReminder" :key="item.id">
            <span>{{item.title}}</span>
          </li>
        </ul>
        <span v-else>오늘은 한가한 하루네요!</span>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped></style>
