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
  console.log('111', calendarMatrix.value);
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
      <div href="#" @click.prevent="prevMonth">
        <img src="/image/button.png" alt="이전 달 보기" class="rotate" />
      </div>
      <span
        ><b>{{ reminderStore.state.currentYear }}</b
        >년</span
      >
      <span>
        <b>{{ reminderStore.state.currentMonth }}</b
        >월</span
      >
      <div href="#" @click.prevent="nextMonth">
        <img src="/image/button.png" alt="다음 달 보기" />
      </div>
    </h3>
    <div class="header calendar-grid">
      <div v-for="day in dayOfWeek" :key="day" class="day-header">
        {{ day }}
      </div>
    </div>
    <div class="body calendar-grid">
      <div
        v-for="(dayOfMonth, index) in calendarMatrix.flat()"
        :key="index"
        class="day-cell"
        :class="{
          today_color: todayColor(dayOfMonth.date),
          reminder_color: dayOfMonth.hasReminder,
          empty: !dayOfMonth.date,
          sunday_color: index % 7 === 0,
        }"
        @click="pickDate(dayOfMonth.date)"
      >
        {{ dayOfMonth.date }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  border-radius: 20px;
  border: #dedede solid 1px;
  margin-top: 70px;
  width: clamp(300px, 40vw, 630px);
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
    div {
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
  .calendar-grid {
    color: #000;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    // width: clamp(300px, 40vw, 630px);
  }
  .day-header {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: clamp(12px, 3vw, 25px);
  }

  .day-cell {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: clamp(12px, 3vw, 25px);
    border-radius: 50%;
    cursor: pointer;
    margin: 1vw;

    &.reminder_color {
      background-color: #bfeaff;
    }
    &.today_color {
      color: steelblue;
    }
    &.sunday_color {
      color: tomato;
    }
    &.empty {
      background: none;
      cursor: default;
    }
  }
}
// @media (max-width: 768px) {
//   .calendar {
//     padding: 25px 30px 15px;
//     .calendar_title {
//       font-size: 20px;
//       gap: 5px;
//     }
//     .table {
//       font-size: 20px;
//       td {
//         height: 50px;
//         .date {
//           width: 35px;
//           height: 35px;
//         }
//       }
//     }
//   }
// }

// @media (max-width: 425px) {
//   .calendar {
//     padding: 15px 20px 5px;
//     .calendar_title {
//       font-size: 14px;
//       gap: 5px;
//       div {
//         img {
//           width: 15px;
//         }
//       }
//     }
//     .table {
//       font-size: 12px;
//       td {
//         height: 34px;

//         padding: 3px;
//         .date {
//           width: 28px;
//           height: 28px;
//         }
//       }
//     }
//   }
// }
</style>
