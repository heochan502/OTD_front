<script setup>
import Weather from '@/views/weather/weather.vue';
import { getByMonth } from '@/services/reminder/reminderService';
import { onMounted, reactive } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';

const reminderStore = useReminderStore();

const state = reactive({
  todayReminder: [],
});

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();

onMounted(async () => {
  if (reminderStore.state.fullReminder.length === 0) {
    const res = await getByMonth(year, month);
    if (res && res.status === 200) {
      reminderStore.setFullReminder(res.data);
    }
  }

  const formattedToday = `${year}-${String(month).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const dow = today.getDay();

  state.todayReminder = reminderStore.state.fullReminder.filter((item) => {
    const isFixed = item.date === formattedToday;
    const isRepeat =
      item.repeat &&
      item.repeatDow?.includes(dow) &&
      new Date(formattedToday) >= new Date(item.created);

    return isFixed || isRepeat;
  });
});
</script>

<template>
  <Weather />
  <router-link to="/reminder">
    <div>
      <span>오늘의 일정</span>
      <br />
      <span>{{ todayYear }}년 {{ todayMonth }}월 {{ todayDate }}일</span>
      <ul v-if="state.todayReminder.length > 0">
        <li v-for="item in state.todayReminder" :key="item.id">
          <span>{{ item.title }}</span>
        </li>
      </ul>
      <span v-else>오늘은 한가한 하루네요!</span>
    </div>
  </router-link>
</template>

<style scoped></style>
