<script setup>
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
  <div class="header flex justify-between items-center w-full px-4 pt-2">
    <span class="list-title px-4 py-1 text-white font-semibold text-sm"
      >오늘의 일정</span
    >
  </div>
  <div class="reminder">
    <span class="list-date">
      {{ todayYear }}년 {{ todayMonth }}월 {{ todayDate }}일</span
    >
    <ul class="list">
      <router-link class="link" to="/reminder">
        <template v-if="state.todayReminder.length > 0">
          <li
            v-for="item in state.todayReminder"
            :key="item.id"
            class="list-card"
          >
            <span class="reminder-title">• {{ item.title }}</span>
          </li>
        </template>
        <template v-else>
          <li class="empty-wrapper">
            <span class="empty-comment">"오늘은 한가한 하루네요!"</span>
          </li>
        </template>
      </router-link>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 8px;
  user-select: none;

  .list-title {
    width: 180px;
    height: 3rem;
    background-color: #3bbeff;
    line-height: 42px;
    text-align: center;
    border-radius: 25px 25px 0 0;
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
  user-select: none;
}

.link {
  text-decoration: none;

  &:hover {
    background-color: #bfeaff;
  }
}

.reminder {
  background-color: #bfeaff;
  margin: 0 1rem;
  border-radius: 0 16px 0 0;
  padding: 1rem;
  min-height: 400px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.4);
  &::-webkit-scrollbar {
    display: none;
  }
  .list {
    list-style: none;
    padding: 0;
    margin: 1rem;

    .list-card {
      width: 100%;
      height: 55px;
      background-color: #fff;
      margin-bottom: 8px;
      border-radius: 30px;
      display: flex;
      align-items: center;

      .reminder-title {
        color: #575757;
        margin-left: 15px;
        font-weight: bold;
      }
    }
  }
}
.empty-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  width: 100%;
}

.empty-comment {
  width: 100%;
  text-align: center;
  color: #575757;
  font-weight: bold;
  font-size: 20px;
  margin: 0.5rem 0;
}
</style>
