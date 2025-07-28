<script setup>
import { ref, onMounted, watch } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';

const reminderStore = useReminderStore();

const props = defineProps({
  reminderDate: {
    type: Array,
    default: () => [],
  },
  usePage: { type: String, default: 'home' },
});
const emit = defineEmits(['selected-date', 'reminder-date', 'click-date']);
console.log('props', props.reminderDate);

const formatNumber = (n) => String(n).padStart(2, '0');

// 캘린더 날짜 선택시의 홈, 폼 emit 분기문
const pickDate = (day) => {
  if (!day) return;
  const selectedDate = new Date(
    `${currentYear.value}-${formatNumber(currentMonth.value)}-${formatNumber(
      day
    )}`
  );
  if (props.usePage === 'form') {
    emit('selected-date', selectedDate);
  } else if (props.usePage === 'home') {
    emit('click-date', selectedDate);
  }
};

const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const calendarMatrix = ref([]);

const today = new Date();

const currentYear = ref(today.getFullYear());

const currentMonth = ref(today.getMonth() + 1);
// getMonth는 0부터 시작함

// const startYear = 2003;
// const startDowIdx = new Date(startYear, 0, 1).getDay();

// 원하는 년, 월의 마지막 날짜 구하기(윤년처리까지)
// const lastDayOfMonth = (year, month) => {
//   if (month === 2) {
//     return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
//   } else {
//     const month30 = [1, 3, 5, 7, 8, 10, 12];
//     return month30.includes(month) ? 31 : 30;
//   }
// };
const lastDayOfMonth = (year, month) => new Date(year, month, 0).getDate();
// console.log('last', lastDayOfMonth(2025, 7));

// 원하는 년,월의 시작 요일 구하기
// const startIdxOfMonth = (thisYear, thisMonth) => {
//   let totalDay = startDowIdx;
//   for (let year = startYear; year < thisYear; year++) {
//     totalDay +=
//       (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
//   }
//   for (let month = 1; month < thisMonth; month++) {
//     totalDay += lastDayOfMonth(thisYear, month);
//   }
//   return totalDay % 7;
// };
const startIdxOfMonth = (year, month) => new Date(year, month - 1, 1).getDay();
// console.log('idx', startIdxOfMonth(2025, 7));

// 캘린더 그리기 로직
const makeCalendar = () => {
  const startIdx = startIdxOfMonth(currentYear.value, currentMonth.value);
  const endDay = lastDayOfMonth(currentYear.value, currentMonth.value);
  // console.log('startIdx', startIdx);
  // console.log('endDay', endDay);

  const matrix = [];
  let day = 1;

  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let k = 0; k < 7; k++) {
      if (i === 0 && k < startIdx) {
        row.push({ date: '', hasReminder: false });
      } else if (day <= endDay) {
        const fullDate = `${currentYear.value}-${formatNumber(
          currentMonth.value
        )}-${formatNumber(day)}`;

        const hasReminder = props.reminderDate.includes(fullDate);

        row.push({ date: day, hasReminder });
        day++;
      } else {
        row.push({ date: '', hasReminder: false });
      }
    }
    matrix.push(row);
    if (day > endDay) {
      break;
    }
  }
  calendarMatrix.value = matrix;
};

onMounted(() => {
  makeCalendar();
  changeMonth();
});
// console.log('calendar', calendarMatrix);

watch(
  () => props.reminderDate,
  () => {
    makeCalendar();
  },
  { immediate: true, deep: true }
);

// 달 이동 버튼 눌렀을때 홈 화면에 보낼 년, 월 정보 에밋 / 피니아 년 월 정보 업데이트
const changeMonth = () => {
  emit('reminder-date', {
    year: currentYear.value,
    month: currentMonth.value,
  });

  reminderStore.setCurrentYear(currentYear.value);
  reminderStore.setCurrentMonth(currentMonth.value);
};

// 이전 달 보기
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  makeCalendar();
  changeMonth();
};

// 다음 달 보기
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  makeCalendar();
  changeMonth();
};

// 오늘 날짜 색 표시
const todayColor = (day) => {
  const today = new Date();
  return (
    currentYear.value === today.getFullYear() &&
    currentMonth.value === today.getMonth() + 1 &&
    day === today.getDate()
  );
};
</script>
<template>
  <div class="calendar">
    <h2 class="calendar_title">
      <a href="#" @click.prevent="prevMonth"
        ><img src="/src/image/button.png" alt="이전 달 보기" class="rotate"
      /></a>
      <b>{{ currentYear }}</b
      >년 <b>{{ currentMonth }}</b
      >월
      <a href="#" @click.prevent="nextMonth"
        ><img src="/src/image/button.png" alt="다음 달 보기"
      /></a>
    </h2>
    <table class="table">
      <thead>
        <tr>
          <td v-for="dayOfWeek in dayOfWeek" :key="dayOfWeek">
            <b>{{ dayOfWeek }}</b>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowOfMonth, index) in calendarMatrix" :key="index">
          <td
            v-for="(dayOfMonth, index) in rowOfMonth"
            :key="index"
            :class="{
              today_color: todayColor(dayOfMonth.date),
              sunday_color: index === 0,
            }"
            class="day"
            @click="pickDate(dayOfMonth.date)"
          >
            <span
              class="date"
              :class="{ reminder_color: dayOfMonth.hasReminder }"
            >
              {{ dayOfMonth.date }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  border-radius: 20px;
  margin-top: 50px;
  margin-left: 50px;
  width: 600px;
  padding: 30px;
  background-color: #fff;

  .calendar_title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    gap: 5px;
    a {
      display: flex;
      align-items: center;
      img {
        width: 25px;
      }
      img.rotate {
        transform: rotate(180deg);
      }
    }
    a:hover {
      background-color: #fff;
    }
  }
  .table {
    font-size: 25px;
    td {
      border-bottom: none;
      cursor: pointer;
      text-align: center;
      vertical-align: middle;
      .date {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        font-weight: bold;
        border-radius: 100%;
      }
      .reminder_color {
        background-color: rgb(205, 236, 250);
      }
    }
    .today_color {
      color: steelblue;
    }
    .sunday_color {
      color: tomato;
    }
    td {
      height: 70px;
    }
  }
}
</style>
