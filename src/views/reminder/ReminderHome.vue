<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getByMonth } from '@/services/reminder/reminderService';
import { getByDay } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';
import Calendar from '@/components/reminder/Calendar.vue';

const reminderStore = useReminderStore();

const router = useRouter();

const today = new Date();

const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();

const state = reactive({
  reminderDate: [], // 한달치 리마인더 날짜
  todayReminder: [], // 오늘 리마인더 미리보기 내용
});

const getDate = async (date) => {
  const res = await getByMonth(date.year, date.month);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  reminderStore.setFullReminder(res.data);
  state.reminderDate = state.fullReminder.filter((item) => item.date);
};

// 캘린더 날짜 선택시의 홈, 폼 router 분기문
const routerDate = (date) => {
  console.log(date);
  // 넘어오는 데이터 확인 후 수정 예정
  const hasReminder = state.reminderDate.find((item) => item.date === date);

  if (hasReminder) {
    const dayReminder = state.fullReminder.filter((item) => item.date === date);
    reminderStore.setDayReminder(dayReminder);
    router.push('/reminder/list');
  } else {
    router.push('reminder/form');
  }
};

// 일정 미리보기 영역 클릭시 리스트 페이지로 라우팅 처리 될 때의 피니아 값 주입
const setTodayReminder = () => {
  // 형식 변경 가능성 있음
  const todayReminder = state.fullReminder.filter(
    (item) => item === `${todayYear}.${todayMonth}.${todayDate}`
  );
  reminderStore.setDayReminder(todayReminder);
};
onMounted(async () => {
  const res = await getByDay(todayYear, todayMonth, todayDate);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  state.todayReminder = res.data;
});
</script>

<template>
  <div class="reminder">
    <div>
      <Calendar
        @reminder-date="getDate"
        @click-date="routerDate"
        :reminder-date="state.reminderDate"
        use-page="home"
      ></Calendar>
    </div>
    <div><router-link to="/reminder/form">일정 추가하기</router-link></div>
    <router-link to="/reminder/list" class="list" @click="setTodayReminder">
      <div>
        <span class="list_title">오늘의 일정</span>
        <br />
        <span class="list_date"
          >{{ todayYear }}년 {{ todayMonth }}월 {{ todayDate }}일</span
        >
        <ul v-if="state.todayReminder">
          <li v-for="item in state.todayReminder" :key="item.id">
            <span>{{ item.title }}</span>
          </li>
        </ul>
        <span v-else>오늘은 한가한 하루네요!</span>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped></style>
