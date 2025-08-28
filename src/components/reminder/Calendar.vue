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
const emit = defineEmits(['click-date', 'reminder-date']);

const formatNumber = (n) => String(n).padStart(2, '0');

// 캘린더 날짜 선택시의 emit
const pickDate = (day) => {
  if (!day) return;
  const selectedDate = new Date(
    reminderStore.state.currentYear,
    reminderStore.state.currentMonth - 1,
    day
  );
  emit('click-date', selectedDate);
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
  const startIdx = startIdxOfMonth(
    reminderStore.state.currentYear,
    reminderStore.state.currentMonth
  );
  const endDay = lastDayOfMonth(
    reminderStore.state.currentYear,
    reminderStore.state.currentMonth
  );
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
        const fullDate = `${reminderStore.state.currentYear}-${formatNumber(
          reminderStore.state.currentMonth
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
    year: reminderStore.state.currentYear,
    month: reminderStore.state.currentMonth,
  });

  // reminderStore.setCurrentYear(currentYear.value);
  // reminderStore.setCurrentMonth(currentMonth.value);
};

// 이전 달 보기
const prevMonth = () => {
  if (reminderStore.state.currentMonth === 1) {
    reminderStore.state.currentMonth = 12;
    reminderStore.state.currentYear--;
  } else {
    reminderStore.state.currentMonth--;
  }
  makeCalendar();
  changeMonth();
};

// 다음 달 보기
const nextMonth = () => {
  if (reminderStore.state.currentMonth === 12) {
    reminderStore.state.currentMonth = 1;
    reminderStore.state.currentYear++;
  } else {
    reminderStore.state.currentMonth++;
  }
  makeCalendar();
  changeMonth();
};

// 오늘 날짜 색 표시
const todayColor = (day) => {
  const today = new Date();
  return (
    reminderStore.state.currentYear === today.getFullYear() &&
    reminderStore.state.currentMonth === today.getMonth() + 1 &&
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
        ><b>{{ reminderStore.state.currentYear }}</b
        >년</span
      >
      <span>
        <b>{{ reminderStore.state.currentMonth }}</b
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
  border: #dedede solid 1px;
  margin-top: 70px;
  width: 630px;
  background-color: #fff;
  padding: 35px 45px 25px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .calendar_title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    gap: 10px;
    cursor: pointer;
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
      height: 70px;
      .date {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        font-weight: bold;
        border-radius: 100%;
        margin: auto;
      }
      .reminder_color {
        background-color: #bfeaff;
      }
    }
    .sunday_color {
      color: tomato;
    }
    .today_color {
      color: steelblue;
    }
    td {
      height: 70px;
    }
  }
}
</style>
