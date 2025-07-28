<script setup>
import { reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getByMonth } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';
import Calendar from '@/components/reminder/Calendar.vue';

const reminderStore = useReminderStore();

const router = useRouter();

const formatNumber = (n) => String(n).padStart(2, '0');
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = formatNumber(date.getMonth() + 1);
  const d = formatNumber(date.getDate());
  return `${y}-${m}-${d}`;
};

const today = new Date();

const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();

const state = reactive({
  reminderDate: [], // 한달치 리마인더 날짜
  todayReminder: [], // 오늘 리마인더 미리보기 내용
});

onMounted(async () => {
  getReminderList({ year: todayYear, month: todayMonth });
  setTodayReminder();
});

watch(
  () => reminderStore.reload,
  (data) => {
    console.log('reminderStore.state.reload', reminderStore.reload);
    if (data) {
      getReminderList({ year: todayYear, month: todayMonth });
      setTodayReminder();
      reminderStore.setReload(false);
    }
  }
);

// 한달치 리마인더 목록(요일반복 포함) 조회
const getReminderList = async (date) => {
  const res = await getByMonth(date.year, date.month);
  console.log('res.date', res.data);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  reminderStore.setFullReminder(res.data);
  console.log('date1111', res.data);

  const fixedDateList = res.data
    .filter((item) => item.date)
    .map((item) => item.date);
  console.log('fixedDateList', fixedDateList);

  const repeatDateList = getRepeatDate(res.data, date.year, date.month);
  console.log('repeatDateList', repeatDateList);

  const merge = Array.from(new Set([...fixedDateList, ...repeatDateList]));
  state.reminderDate = merge;
};

// 요일 반복 리마인더 해당 요일 날짜로 변환 로직
const getRepeatDate = (fullReminder, year, month) => {
  const result = [];
  const end = new Date(year, month, 0).getDate();

  for (let day = 1; day <= end; day++) {
    const date = new Date(year, month - 1, day);
    const dow = date.getDay();

    for (const item of fullReminder) {
      if (item.repeat && item.repeatDow?.includes(dow)) {
        const created = new Date(item.created);
        if (date >= created) {
          result.push(formatDate(date));
          break;
        }
      }
    }
  }
  return result;
};

// 일정 미리보기 영역 클릭시 리스트 페이지로 라우팅 처리 될 때의 피니아 값 주입
const setTodayReminder = () => {
  const todayDow = today.getDay();
  const todayReminder = reminderStore.state.fullReminder.filter((item) => {
    return (
      item.date === formatDate(new Date()) ||
      (item.repeat && item.repeatDow?.includes(todayDow))
    );
  });
  state.todayReminder = todayReminder;
  reminderStore.setDayReminder(todayReminder);
};

// 캘린더 날짜 선택시의 홈, 폼 router 분기문
const routerDate = (date) => {
  const formattedDate = formatDate(date);
  const dow = date.getDay();

  const dayReminder = reminderStore.state.fullReminder.filter((item) => {
    const isFixed = item.date === formattedDate;

    const isRepeat =
      item.repeat &&
      item.repeatDow?.includes(dow) &&
      new Date(formattedDate) >= new Date(item.created);

    return isFixed || isRepeat;
  });

  if (dayReminder.length > 0) {
    reminderStore.setSelectedDate(formattedDate);
    router.push('/reminder/list');
  } else {
    router.push('reminder/form');
  }
};
</script>

<template>
  <div class="reminder">
    <div>
      <Calendar
        @reminder-date="getReminderList"
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
        <ul v-if="state.todayReminder.length > 0">
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
