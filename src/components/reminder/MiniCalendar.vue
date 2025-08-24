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
const emit = defineEmits(['selected-date', 'reminder-date']);

const formatNumber = (n) => String(n).padStart(2, '0');

// 캘린더 날짜 선택시의 emit
const pickDate = (day) => {
  if (!day) return;
  const selectedDate = new Date(
    `${currentYear.value}-${formatNumber(currentMonth.value)}-${formatNumber(
      day
    )}`
  );
    emit('selected-fix-date', selectedDate);
    emit('selected-repeat-date', selectedDate);
};

const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const calendarMatrix = ref([]);

const today = new Date();

const currentYear = ref(today.getFullYear());

const currentMonth = ref(today.getMonth() + 1);

const lastDayOfMonth = (year, month) => new Date(year, month, 0).getDate();

const startIdxOfMonth = (year, month) => new Date(year, month - 1, 1).getDay();

// 캘린더 그리기 로직
const makeCalendar = () => {
  const startIdx = startIdxOfMonth(currentYear.value, currentMonth.value);
  const endDay = lastDayOfMonth(currentYear.value, currentMonth.value);

  const matrix = [];
  let day = 1;

  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let k = 0; k < 7; k++) {
      if (i === 0 && k < startIdx) {
        row.push({ date: '' });
      } else if (day <= endDay) {
        row.push({ date: day });
        day++;
      } else {
        row.push({ date: '' });
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
    <h3 class="calendar_title">
      <a href="#" @click.prevent="prevMonth"
        ><img src="/image/button.png" alt="이전 달 보기" class="rotate"
      /></a>
      <span
        ><b>{{ currentYear }}</b
        >년</span
      >
      <span>
        <b>{{ currentMonth }}</b
        >월</span
      >
      <a href="#" @click.prevent="nextMonth"
        ><img src="/image/button.png" alt="다음 달 보기"
      /></a>
    </h3>
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
              :class="{ 'empty-date': dayOfMonth.date === '' }"
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
  border-radius: 10px;
  border: #dedede solid 1px;
  width: 220px;
  height: auto;
  padding: 10px 7px 0 7px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .calendar_title {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    gap: 5px;
    a {
      display: flex;
      align-items: center;
      img {
        width: 20px;
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
    font-size: 15px;
    padding: 0;
    width: 100%;
    table-layout: fixed;
    td {
      border-bottom: none;
      text-align: center;
      vertical-align: middle;
      height: 20px;
      padding: 0;
      .date {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        font-weight: bold;
        border-radius: 100%;
        margin: auto;
      }
      .date:hover {
        background-color: #d9d9d9;
      }
      .date.empty-date:hover {
        background-color: transparent;
        cursor: default;
      }
    }
    .today_color {
      color: steelblue;
    }
    .sunday_color {
      color: tomato;
    }
  }
}
</style>
