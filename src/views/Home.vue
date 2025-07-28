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

  const formattedToday = `${todayYear}-${String(todayMonth).padStart(
    2,
    '0'
  )}-${String(todayDate).padStart(2, '0')}`;
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
  <router-link class="link" to="/reminder">
    <div class="header flex justify-between items-center w-full px-4 pt-2">
      <span class="list-title px-4 py-1 text-white font-semibold text-sm"
        >오늘의 일정</span
      >
    </div>
    <div class="reminder">
      <span class="list-date">
        {{ todayYear }}년 {{ todayMonth }}월 {{ todayDate }}일</span
      >
      <ul v-if="state.todayReminder.length > 0" class="list">
        <li
          v-for="item in state.todayReminder"
          :key="item.id"
          class="list-card"
        >
          <span class="reminder-title">• {{ item.title }}</span>
        </li>
      </ul>
      <span v-else class="empty-comment">"오늘은 한가한 하루네요!"</span>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  border-radius: 16px 16px 0 0;
  color: #fff;

  .list-title {
    background-color: #3bbeff;
    border-radius: 16px 16px 0 0;
    gap: 0;
  }
}
.list-date {
  font-size: 0.85rem;
  font-weight: normal;
  align-self: flex-end;
  color: #fff;
  margin: 1rem;
  font-weight: bold;
}

.link {
  text-decoration: none;

  &:hover {
    background-color: #fff;
  }
}

.reminder {
  background-color: #bfeaff;
  margin: 0 1rem;
  border-radius: 0 16px 16px 16px;
  padding: 1rem;
  width: 50%;
}

.list {
  list-style: none;
  padding: 0;
  margin: 1rem;

  .list-card {
    width: 100%;
    height: 35px;
    background-color: #fff;
    margin-bottom: 8px;
    border-radius: 20px;
    display: flex;
    align-items: center;

    .reminder-title {
      color: #575757;
      margin-left: 15px;
      font-weight: bold;
    }
  }
}
.empty-comment {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  color: #575757;
  font-weight: bold;
  font-size: 20px;
  // margin: 0 auto;
  white-space: nowrap;
}
</style>
