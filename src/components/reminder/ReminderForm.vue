<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import MiniCalendar from '@/components/reminder/MiniCalendar.vue';
import { save } from '@/services/reminder/reminderService';
import { modify } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';

const reminderStore = useReminderStore();
const emit = defineEmits(['form-close']);

const state = reactive({
  reminder: {
    id: 0,
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    alarm: false,
    repeat: false,
    repeatDow: [],
  },
});

const props = defineProps({
  startDate: { type: String },
  id: { type: Number },
});

const showDateCalendar = ref(false);
const showRepeatCalendar = ref(false);
// const selectedStartDate = ref(new Date());

// 캘린더에서 날짜 선택했을때 실행할 로직
const selectedDate = (day) => {
  //selectedStartDate.value = day;  화면에 나타날 날짜 데이터값 변경
  showDateCalendar.value = false; // 달력 닫기

  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, '0');
  const d = String(day.getDate()).padStart(2, '0');
  state.reminder.startDate = `${y}-${m}-${d}`; // 넘길 데이터 저장

  if (state.reminder.repeat) {
    state.reminder.repeat = false; // 요일 반복 비활성화
    state.reminder.repeatDow = [];
    state.reminder.endDate = '';
    dowImage.value.forEach((item) => (item.isOn = false));
  }
};

const selectedRepeat = (day) => {
  showRepeatCalendar.value = false;
  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, '0');
  const d = String(day.getDate()).padStart(2, '0');
  state.reminder.endDate = `${y}-${m}-${d}`;
};

const openCalendar = (use) => {
  if (use === 'date') {
    if (state.reminder.repeat) {
      showRepeatCalendar.value = false;
      state.reminder.repeat = false;
      state.reminder.repeatDow = [];
      state.reminder.endDate = '';
      dowImage.value.forEach((item) => (item.isOn = false));
    }
    showDateCalendar.value = !showDateCalendar.value;
  } else if (use === 'repeat') {
    state.reminder.repeat = true;
    showDateCalendar.value = false;
    showRepeatCalendar.value = !showRepeatCalendar.value;
  }
};

// 화면에 나타낼 날짜 포맷 변경
// const formattedDate = computed(() => {
//   const selected = new Date(selectedStartDate.value);
//   const y = selected.getFullYear();
//   const m = String(selected.getMonth() + 1).padStart(2, '0');
//   const d = String(selected.getDate()).padStart(2, '0');
//   return `${y}-${m}-${d}`;
// });

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
  showDateCalendar.value = false;
  dowImage.value[index].isOn = !dowImage.value[index].isOn;

  const activeIndex = dowImage.value
    .map((item, i) => (item.isOn ? i : null))
    .filter((item) => item !== null);

  state.reminder.repeatDow = activeIndex;
  state.reminder.repeat = activeIndex.length > 0;

  // 추가 폼일때만 작동하게
  if (state.reminder.repeat && state.reminder.id === 0) {
    state.reminder.startDate = reminderStore.state.selectedDate;
  }
};

// 날짜-요일 활성화 비활성화 처리
const isDateMode = computed(() => !state.reminder.repeat);
const isRepeatMode = computed(() => state.reminder.repeat);

onMounted(() => {
  console.log(reminderStore.state.selectedDate);
  state.reminder.startDate = reminderStore.state.selectedDate;
  if (props.id) {
    const modifyReminder = reminderStore.state.fullReminder.find(
      (item) => item.id === props.id
    );

    console.log('mod', modifyReminder);
    if (modifyReminder) {
      Object.assign(state.reminder, {
        id: modifyReminder.id,
        title: modifyReminder.title,
        content: modifyReminder.content,
        startDate: modifyReminder.startDate,
        endDate: modifyReminder.endDate,
        alarm: modifyReminder.alarm,
        repeat: modifyReminder.repeat,
        repeatDow: [...(modifyReminder.repeatDow || [])],
      });
    }

    if (state.reminder.repeat) {
      dowImage.value.forEach((item, index) => {
        item.isOn = state.reminder.repeatDow.includes(index);
      });
    }
  }
  console.log('reminder', state.reminder);
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
    startDate: state.reminder.startDate,
    endDate: state.reminder.endDate,
    repeat: state.reminder.repeat,
    repeatDow: state.reminder.repeatDow,
    alarm: state.reminder.alarm,
  };
  if (state.reminder.id > 0) {
    jsonBody.id = state.reminder.id;
    const res = await modify(jsonBody);
    if (res === undefined || res.status !== 200) {
      alert('오류발생');
      return;
    }
    alert('일정을 수정했어요!');
    emit('form-close', 'modify');
  } else {
    const res = await save(jsonBody);
    if (res === undefined || res.status !== 200) {
      alert('오류발생');
      return;
    }
    alert('일정을 추가했어요!');
    reminderStore.setReload(true);
    emit('form-close');
  }
};

const close = () => {
  emit('form-close', 'form');
};
</script>

<template>
  <div class="form">
    <div class="form-card">
      <h2 class="form-title">
        {{ state.reminder.id ? '리마인더 수정하기' : '리마인더 추가하기' }}
      </h2>
      <div class="cancel">
        <span class="cancel-button" @click="close">
          <img src="/image/cancel.png" alt="취소" class="cancel-img" />
        </span>
      </div>
      <div :class="{ disabled: isRepeatMode }" class="calendar-popup">
        <span
          :class="{ on: isDateMode }"
          class="off date-box"
          @click="openCalendar('date')"
          >날짜</span
        >
        <span @click="openCalendar('date')">
          <span class="date">{{ state.reminder.startDate }}</span>
          <img
            src="/image/button.png"
            alt="날짜 선택하기"
            class="calendar-button"
        /></span>
        <div class="calendar">
          <mini-calendar
            v-if="showDateCalendar"
            @selected-fix-date="selectedDate"
            use-page="form"
            class="mini-calendar"
          ></mini-calendar>
        </div>
      </div>
      <span
        :class="{ on: state.reminder.alarm, off: !state.reminder.alarm }"
        class="alarm-box"
        @click="state.reminder.alarm = !state.reminder.alarm"
      >
        <img
          :src="
            state.reminder.alarm
              ? '/image/alarm_on.png'
              : '/image/alarm_off.png'
          "
          alt="알람 상태"
          class="alarm-img"
        />알람 설정</span
      >
      <span :class="{ disabled: isDateMode }">
        <span
          :class="{ on: isRepeatMode }"
          class="off toggle-box"
          @click="openCalendar('repeat')"
          >요일 반복 |
          {{
            state.reminder.endDate
              ? `종료일 : ${state.reminder.endDate}`
              : '종료일 없음'
          }}</span
        >
        <div class="calendar-popup">
          <mini-calendar
            v-if="showRepeatCalendar"
            @selected-repeat-date="selectedRepeat"
            use-page="form"
            class="calendar mini-calendar"
          >
          </mini-calendar>
        </div>
        <div class="img">
          <img
            v-for="(dow, index) in dowImage"
            :key="index"
            :src="`/image/${dow.key}_${dow.isOn ? 'on' : 'off'}.png`"
            :alt="dow.name"
            @click="imageToggle(index)"
            class="toggle-img"
          />
        </div>
      </span>
      <div>
        <input
          type="text"
          class="title"
          placeholder="어떤 일정이 있으신가요?"
          v-model="state.reminder.title"
          @keyup.enter="submit"
        />
      </div>
      <div>
        <textarea
          name="내용"
          class="content"
          placeholder="내용을 추가해주세요!"
          v-model="state.reminder.content"
          @keyup.enter="submit"
        ></textarea>
      </div>
      <button @click="submit" class="button">
        {{ state.reminder.id > 0 ? '수정하기' : '추가하기' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  width: 400px;
  margin: 80px auto;
  background-color: transparent;

  .form-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #000;
    margin-bottom: 25px;
  }

  .form-card {
    cursor: pointer;
    position: relative;
    border-radius: 10px;
    background-color: #fff;
    padding: 20px 30px 30px 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 500px;

    .cancel {
      display: flex;

      .cancel-button {
        display: inline-flex;
        margin-left: auto;

        .cancel-img {
          display: block;
          width: 24px;
          height: 24px;
          top: 10px;
          right: 10px;
          cursor: pointer;
        }
      }
    }

    .date-box {
      margin-right: 197px;
    }
    .calendar-popup {
      position: relative;

      .date,
      .calendar-button {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }

      .date {
        font-size: 18px;
        color: #5d5d5d;
        font-weight: bold;
      }

      .calendar-button {
        width: 20px;
        margin-left: 8px;
        transform: rotate(90deg);
        cursor: pointer;
      }

      .calendar {
        position: absolute;
        z-index: 99999999999;
        margin-top: 10px;

        .mini-calendar {
          margin-top: -5px;
        }
      }

      .mini-calendar {
        margin-top: -5px;
      }
    }
    .alarm-box {
      margin-right: 87px;
      cursor: pointer;
    }

    .alarm-img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }

    .toggle-box {
      margin-right: 0;
    }

    .toggle-img {
      width: 40px;
      height: 40px;
      margin: 5px;
      border-radius: 50%;
      cursor: pointer;
    }

    .img img:nth-child(1) {
      margin-left: 0;
    }
    .img img:nth-child(7) {
      margin-right: 0;
    }

    .title,
    .content {
      width: 100%;
      border: 2px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      font-size: 16px;
      margin-top: 15px;
      resize: none;
      cursor: pointer;
    }

    .title:focus,
    .content:focus {
      outline: none;
      border-color: #2a9df4;
      box-shadow: 0 0 0 3px rgba(42, 157, 244, 0.15);
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
      margin-top: 10px;

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
  background-color: #3bbeff;
  color: #fff;
}
</style>
