<script setup>
import { ref, computed, reactive, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Calendar from '@/components/reminder/Calendar.vue';
import { save } from '@/services/reminder/reminderService';
import { modify } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';

const router = useRouter();
const route = useRoute();
const reminderStore = useReminderStore();

const state = reactive({
  reminder: {
    id: 0,
    title: '',
    content: '',
    date: '',
    alarm: false,
    repeat: false,
    repeatDow: [],
  },
});

const showCalendar = ref(false);
const selectedDate = ref(new Date());

// 캘린더에서 날짜 선택했을때 실행할 로직
const selectedDone = (day) => {
  selectedDate.value = day; // 화면에 나타날 날짜 데이터값 변경
  showCalendar.value = false; // 달력 닫기

  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, '0');
  const d = String(day.getDate()).padStart(2, '0');
  state.reminder.date = `${y}-${m}-${d}`; // 넘길 데이터 저장

  if (state.reminder.repeat) {
    state.reminder.repeat = false; // 요일 반복 비활성화
    state.reminder.repeatDow = [];
    dowImage.value.forEach((item) => (item.isOn = false));
  }
};

const openCalendar = () => {
  if (state.reminder.repeat) {
    state.reminder.repeat = false;
    state.reminder.repeatDow = [];
    dowImage.value.forEach((item) => (item.isOn = false));
  }
  showCalendar.value = !showCalendar.value;
};

// 화면에 나타낼 날짜 포맷 변경
const formattedDate = computed(() => {
  const selected = new Date(selectedDate.value);
  const y = selected.getFullYear();
  const m = String(selected.getMonth() + 1).padStart(2, '0');
  const d = String(selected.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
});

// 이미지 토글, 요일 선택시 배열 추가/변경 로직
const dowImage = ref([
  { name: '일', key: 'sun', isOn: false },
  { name: '월', key: 'mon', isOn: false },
  { name: '화', key: 'tue', isOn: false },
  { name: '수', key: 'wed', isOn: false },
  { name: '목', key: 'thu', isOn: false },
  { name: '금', key: 'fri', isOn: false },
  { name: '토', key: 'sat', isOn: false },
]);
const imageToggle = (index) => {
  dowImage.value[index].isOn = !dowImage.value[index].isOn;

  const activeIndex = dowImage.value
    .map((item, i) => (item.isOn ? i : null))
    .filter((item) => item !== null);

  state.reminder.repeatDow = activeIndex;
  state.reminder.repeat = activeIndex.length > 0;

  if (state.reminder.repeat) {
    state.reminder.date = '';
  }
};

// 날짜-요일 활성화 비활성화 처리
const isDateMode = computed(() => state.reminder.date !== '');
const isRepeatMode = computed(() => state.reminder.repeat);

// 쿼리스트링으로 id가 있으면 해당 리마인더 내용 띄우기
const reminderId = Number(route.query.id);
// 쿼리스트링은 문자열 즉, id랑 타입 안맞음
onMounted(() => {
  if (reminderId) {
    const modifyReminder = reminderStore.state.fullReminder.find(
      (item) => item.id === reminderId
    );

    if (modifyReminder) {
      Object.assign(state.reminder, {
        id: modifyReminder.id,
        title: modifyReminder.title,
        content: modifyReminder.content,
        date: modifyReminder.date,
        alarm: modifyReminder.alarm,
        repeat: modifyReminder.repeat,
        repeatDow: [...(modifyReminder.repeatDow || [])],
      });
    }

    if (state.reminder.date) {
      const [y, m, d] = state.reminder.date.split('-');
      selectedDate.value = new Date(`${y}-${m}-${d}`);
    } else if (state.reminder.repeat) {
      dowImage.value.forEach((item, index) => {
        item.isOn = state.reminder.repeatDow.includes(index);
      });
    }
  }
});

// 서버 통신 로직
const submit = async () => {
  if (!isDateMode.value && !isRepeatMode.value) {
    alert('날짜 혹은 요일을 지정해주세요!');
    return;
  }
  if (!state.reminder.title) {
    alert('제목이 없어요!');
    return;
  } else if (state.reminder.title.length > 15) {
    alert('제목은 15자 이내로 작성해 주세요!');
    return;
  }
  if (state.reminder.content.length > 30) {
    alert('내용은 30자 이내로 작성해 주세요!');
    return;
  }

  const jsonBody = {
    title: state.reminder.title,
    content: state.reminder.content,
    date: state.reminder.date,
    repeat: state.reminder.repeat,
    repeatDow: state.reminder.repeatDow,
    alarm: state.reminder.alarm,
  };
  console.log('jsonBody', jsonBody);
  let res = null;
  if (state.reminder.id > 0) {
    jsonBody.id = state.reminder.id;
    console.log('modify', jsonBody);
    res = await modify(jsonBody);
    if (res === undefined || res.status !== 200) {
      alert('오류발생');
      return;
    }
    alert('일정을 수정했어요!');
    router.push('/reminder/list');
  } else {
    res = await save(jsonBody);
    console.log('res!!', res.data);
    if (res === undefined || res.status !== 200) {
      alert('오류발생');
      return;
    }
    alert('일정을 추가했어요!');
    reminderStore.setReload(true);
    console.log('pinia', reminderStore.reload);
    router.push('/reminder');
  }
};
</script>

<template>
  <div class="form">
    <h2 class="form-title">
      {{ state.reminder.id ? '리마인더 수정하기' : '리마인더 추가하기' }}
    </h2>
    <div class="form-card">
      <span>
        <img src="/src/image/cancel.png" alt="취소" class="cancel" />
      </span>
      <div :class="{ disabled: isRepeatMode }">
        <span :class="{ on: isDateMode }" class="off">날짜 지정</span>
        <span class="date">{{ formattedDate }}</span>
        <img
          src="/src/image/button.png"
          alt="날짜 선택하기"
          @click="openCalendar"
          class="calendar-button"
        />
        <div class="calendar">
          <calendar
            v-if="showCalendar"
            @selected-date="selectedDone"
            use-page="form"
          ></calendar>
        </div>
      </div>
        <span :class="{ on: state.reminder.alarm, off: !state.reminder.alarm }">
          <img
            :src="
              state.reminder.alarm
                ? '/src/image/alarm_on.png'
                : '/src/image/alarm_off.png'
            "
            alt="알람 상태"
            class="alarm-img"
            @click="state.reminder.alarm = !state.reminder.alarm"
          />알람 설정</span
        >
      <div :class="{ disabled: isDateMode }">
        <span :class="{ on: isRepeatMode }" class="off">요일 반복</span>
        <img
          v-for="(dow, index) in dowImage"
          :key="index"
          :src="`/src/image/${dow.key}_${dow.isOn ? 'on' : 'off'}.png`"
          :alt="dow.name"
          @click="imageToggle(index)"
          class="toggle-img"
        />
      </div>
      <div>
        <input
          type="text"
          class="title"
          placeholder="어떤 일정이 있으신가요?"
          v-model="state.reminder.title"
        />
      </div>
      <div>
        <textarea
          name="내용"
          class="content"
          placeholder="내용을 추가해주세요!"
          v-model="state.reminder.content"
        ></textarea>
      </div>
      <button @click="submit">
        {{ state.reminder.id > 0 ? '수정하기' : '추가하기' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  width: 400px;
  margin: 80px auto;
  background-color: #fff;

  .form-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
  }

  .form-card {
    position: relative;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .cancel {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }

    .date,
    .calendar-button {
      display: inline-block;
      vertical-align: middle;
    }

    .date {
      margin-left: 10px;
      font-size: 18px;
      color: #666;
    }

    .calendar-button {
      width: 20px;
      margin-left: 8px;
      transform: rotate(90deg);
      cursor: pointer;
    }

    .calendar {
      margin-top: 10px;
    }

    .alarm-img {
      width: 20px;
      margin-right: 5px;
    }

    .toggle-img {
      width: 40px;
      height: 40px;
      margin: 5px;
      border-radius: 50%;
      cursor: pointer;
    }

    .title,
    .content {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      font-size: 16px;
      margin-top: 15px;
      resize: none;
    }

    .content {
      height: 80px;
    }

    .button {
      width: 100%;
      background-color: #3bbeff;
      color: white;
      font-size: 16px;
      font-weight: bold;
      padding: 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 20px;

      &:hover {
        background-color: #1aaeff;
      }
    }
  }
}

.disabled {
  opacity: 0.5;
}

.on,
.off {
  display: inline-block;
  font-size: 14px;
  border-radius: 5px;
  padding: 6px 10px;
  margin: 10px 5px 5px 0;
}

.off {
  background-color: #d9d9d9;
  color: #fff;
}
.on {
  background-color: #bfeaff;
  color: #fff;
}
</style>
