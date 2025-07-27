<script setup>
import { reactive, onMounted } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';
import { useRouter, useRoute } from 'vue-router';
import { deleteById } from '@/services/reminder/reminderService';
import { getByMonth } from '@/services/reminder/reminderService';

const router = useRouter();

const reminderStore = useReminderStore();

const state = reactive({
  reminder: [],
});

const selectedDate = reminderStore.state.selectedDate;
const year = Number(selectedDate.split('-')[0]);
const month = Number(selectedDate.split('-')[1]);
const dow = new Date(selectedDate).getDay();

const getReminderList = async (year, month) => {
  const res = await getByMonth(year, month);
  if (res === undefined || res.status !== 200) {
    alert('리마인더 목록을 불러오는 데 실패했어요!');
    return;
  }

  console.log('listres', res.data);
  reminderStore.setFullReminder(res.data);

  state.reminder = res.data.filter((item) => {
    const isFixed = item.date === selectedDate;
    const isRepeat =
      item.repeat &&
      item.repeatDow?.includes(dow) &&
      new Date(selectedDate) >= new Date(item.created);
    return isFixed || isRepeat;
  });
};


onMounted(async () => {
  if (selectedDate) {
    await getReminderList(year, month);
  } else {
    state.reminder = reminderStore.state.dayReminder;
    reminderStore.setDayReminder([]);
  }
});

const dowImage = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const contentBtn = reactive({});

const viewDetail = (id) => {
  contentBtn[id] = !contentBtn[id];
};

const remove = async (id) => {
  if (!confirm('이 일정을 삭제할까요?')) {
    return;
  }
  console.log('id', id);
  const res = await deleteById(id);
  console.log('resremove', res);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  alert('일정을 삭제했어요!');
  await getReminderList(year, month);
  if (state.reminder.length === 0) {
    router.push('/reminder');
  }
};

const modify = (id) => {
  router.push({ path: '/reminder/form', query: { id } });
};
</script>
<template>
  <div>
    <div>
      <router-link to="/reminder/form">일정 추가하기</router-link>
    </div>
    <ul class="remider">
      <template v-for="reminder in state.reminder" :key="reminder.id">
        <li class="list">
          <div>
            <span class="title">{{ reminder.title }}</span>
            <img
              v-for="(dow, index) in dowImage"
              :key="dow"
              :src="`/src/image/${dow}_${
                reminder.repeat && reminder.repeatDow.includes(index)
                  ? 'on'
                  : 'off'
              }.png`"
              :alt="dow"
              class="img"
            />
            <span v-if="reminder.date" class="date">{{ reminder.date }}</span>
            <span v-else>요일 반복</span>
            <img
              :src="
                reminder.alarm
                  ? '/src/image/alarm_on.png'
                  : '/src/image/alarm_off.png'
              "
              alt="알람 유무"
              class="img"
            />
            <img
              v-if="reminder.content"
              src="/src/image/button.png"
              alt="상세보기"
              @click="viewDetail(reminder.id)"
              class="img"
            />
          </div>
          <div v-if="contentBtn[reminder.id]">
            {{ reminder.content }}
          </div>
        </li>
        <img
          src="/src/image/delete.png"
          alt="삭제"
          @click="remove(reminder.id)"
          class="img"
        />
        <img
          src="/src/image/modify.png"
          alt="수정"
          @click="modify(reminder.id)"
          class="img"
        />
      </template>
    </ul>
  </div>
</template>
<style scoped>
.list {
  background-color: #d8f3ff;
  color: #fff;
}
.img {
  width: 50px;
}
</style>
