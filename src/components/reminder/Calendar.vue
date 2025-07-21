<script setup>
import { ref, onMounted, defineEmits } from 'vue';

// const props = defineProps({
//   initialDate: {
//     type: [Date, String],
//     required: false,
//     dafault: () => new Date(),
//   },
//   data() {
//     return { selectedDate: this.initialDate };
//   },
// });
const emit = defineEmits(['selected-date']);

const pickDate = (day) => {
  if (!day) return;
  const selectedDate = new Date(currentYear.value, currentMonth.value - 1, day);
  console.log('emit', selectedDate);
  emit('selected-date', selectedDate);
};

const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const calendarMatrix = ref([]);

const today = new Date();

const currentYear = ref(today.getFullYear());

const currentMonth = ref(today.getMonth() + 1);
// getMonth는 0부터 시작함

const startYear = 2003;
const startDowIdx = new Date(startYear, 0, 1).getDay();

// 원하는 년, 월의 마지막 날짜 구하기(윤년처리까지)
const lastDayOfMonth = (year, month) => {
  if (month === 2) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  } else {
    const month30 = [1, 3, 5, 7, 8, 10, 12];
    return month30.includes(month) ? 31 : 30;
  }
};
// console.log('last', lastDayOfMonth(2025, 7));
// 원하는 년,월의 시작 요일 구하기
const startIdxOfMonth = (thisYear, thisMonth) => {
  let totalDay = startDowIdx;
  for (let year = startYear; year < thisYear; year++) {
    totalDay +=
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  }
  for (let month = 1; month < thisMonth; month++) {
    totalDay += lastDayOfMonth(thisYear, month);
  }
  return totalDay % 7;
};
// console.log('idx', startIdxOfMonth(2025, 7));

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
        row.push('');
      } else if (day <= endDay) {
        row.push(day);
        day++;
      } else {
        row.push('');
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
});
// console.log('calendar', calendarMatrix);

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  makeCalendar();
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  makeCalendar();
};

const todayColor = (dayOfMonth) => {
  const today = new Date();
  return (
    currentYear.value === today.getFullYear() &&
    currentMonth.value === today.getMonth() + 1 &&
    dayOfMonth === today.getDate()
  );
};
</script>
<template>
  <div class="calendar">
    <h2 class="calendar_title">
      <a href="#" @click.prevent="prevMonth"
        ><img src="/src/image/button.png" alt="이전 달 보기"
      /></a>
      {{ currentYear }}년 {{ currentMonth }}월
      <a href="#" @click.prevent="nextMonth"
        ><img src="/src/image/button.png" alt="다음 달 보기"
      /></a>
    </h2>
    <table class="table">
      <thead>
        <tr>
          <td v-for="dayOfWeek in dayOfWeek" :key="dayOfWeek">
            {{ dayOfWeek }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rowOfMonth in calendarMatrix" :key="rowOfMonth">
          <td
            v-for="dayOfMonth in rowOfMonth"
            :key="dayOfMonth"
            :class="{ today_color: todayColor(dayOfMonth) }"
            class="day"
            @click="pickDate(dayOfMonth)"
          >
            {{ dayOfMonth }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.reminder {
--cal-width : 500px
  display: flex;
  gap: 30px;
  .calendar {
    width: 500px;
    .calendar_title {
      a > img {
        width: 25px;
      }
    }
    .table {
      td {
        text-align: center;
        vertical-align: middle;
        border-bottom: none;
      }
      .today_color {
        color: steelblue;
      }
      td {
        height: 70px;
      }
    }
  }
}
</style>
