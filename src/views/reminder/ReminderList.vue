<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const reminderStore = useReminderStore();

const state = reactive({
  reminder: [],
});

onMounted(() => {
  console.log('dayre', reminderStore.state.dayReminder);
  state.reminder = reminderStore.state.dayReminder;
});

const dowImage = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const content = ref(false);

const viewDetail = () => {
  content.value = !content.value;
};

const remove = async (id) => {
  if (!confirm('이 일정을 삭제할까요?')) {
    return;
  }
  const res = await deleteById(id);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  alert('일정을 삭제했어요!');
  if (state.reminder.length === 0) {
    router.push('/reminder');
  }
};

const modify = (id) => {
  router.push({ path: '/reminder', quary: { id } });
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
                reminder.repeat && reminder.repeatdow.includes(index)
                  ? 'on'
                  : 'off'
              }.png`"
              :alt="dow"
              class="img"
            />
            <span class="date">{{ reminder.date }}</span>
            <img
              :src="
                state.reminder.alarm
                  ? '/src/image/alarm_on.png'
                  : '/src/image/alarm_off.png'
              "
              alt="알람 유무"
              class="img"
            />
            <img
              v-if="state.reminder.content"
              src="/src/image/button.png"
              alt="상세보기"
              @click="viewDetail"
              class="img"
            />
          </div>
          <div v-if="content">
            {{ state.reminder.conctent }}
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
