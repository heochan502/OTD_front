<script setup>
import { reactive, ref } from 'vue';

const state = reactive({
  reminder: [],
});

const dowImage = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const content = ref(false);

const viewDetail = () => {
  content.value = !content.value;
};
</script>
<template>
  <div>
    <div>
      <router-link to="/reminderform">일정 추가하기</router-link>
    </div>
    <ul class="remider">
      <template v-for="reminder in state.reminder" :key="reminder.id">
        <li>
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
            />
            <span class="date">{{ reminder.date }}</span>
            <img
              :src="
                state.reminder.alarm
                  ? '/src/image/alarm_on.png'
                  : '/src/image/alarm_off.png'
              "
              alt="알람 유무"
            />
            <img
              v-if="state.reminder.content"
              src="/src/image/button.png"
              alt="상세보기"
              @click="viewDetail"
            />
          </div>
          <div v-if="content">
            {{ state.reminder.conctent }}
          </div>
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
