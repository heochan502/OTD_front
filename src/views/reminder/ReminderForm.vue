<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Calendar from '@/components/reminder/Calendar.vue';
import { save } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';

const router = useRouter();
const route = useRoute();
const reminderStore = useReminderStore();

const state = reactive({
  reminder: {
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
  state.date = `${y}.${m}.${d}`; // 넘길 데이터 저장

  state.repeat = false; // 요일 반복 비활성화
  state.repeatDow = [];
  dowImage.value.forEach((item) => (item.isOn = false));
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
  const y = selectedDate.value.getFullYear();
  const m = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
  const d = String(selectedDate.value.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d}`;
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

  if (dowImage.value[index].isOn) {
    if (!state.reminder.repeatDow.includes(index)) {
      // 배열에 해당 인덱스값이 없으면 추가
      state.reminder.repeatDow.push(index);
    } else {
      state.reminder.repeatDow = state.reminder.repeatDow.filter(
        (i) => i != index
      ); // 배열에 해당 인덱스값이 있으면 filter로 제거
    }
  }
  state.reminder.repeat = dowImage.value.some((item) => item.isOn); // 배열 값들 중 하나라도 true면 state.repeat true 리턴
  if (state.reminder.repeat) {
    state.reminder.date = '';
  }
};

// 날짜-요일 활성화 비활성화 처리
const isDateMode = computed(() => state.reminder.date !== '');
const isRepeatMode = computed(() => state.reminder.repeat);

//
const reminderId = route.query.id;

onMounted(() => {
  if (reminderId) {
    state.reminder = reminderStore.state.fullReminder.find(
      (item = item.id === reminderId)
    );

    if (state.reminder.date) {
      const [y, m, d] = state.reminder.date.split('.'); //.map((s) => s.trim());
      selectedDate.value = new Date(`${y}.${m}.${d}`);
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
  if (state.reminder.id) {
    jsonBody.id = state.reminder.id;
    res = await modify(jsonBody);
    if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
    }
    alert('일정을 추가했어요!');
    if(reminderStore.state.dayReminder){
      router.push('/reminder/list')}
  } else {
    res = await save(jsonBody);
    if (res === undefined || res.status !== 200) {
      alert('오류발생');
      return;
    }
    alert('일정을 추가했어요!');
  }
  router.push('/reminder');
};
</script>

<template>
  <div>
    <h2>{{ state.reminder.id ? '리마인더 수정하기' : '리마인더 추가하기' }}</h2>
    <div>
      <div>
        <span title="취소"></span>
      </div>
      <div :class="{ disabled: isRepeatMode }">
        <span :class="{ on: isDateMode, off: isRepeatMode }">날짜 지정</span>
        <span>{{ formattedDate }}</span>
        <img
          src="/src/image/button.png"
          alt="날짜 선택하기"
          @click="openCalendar"
          class="pickButton"
        />
        <div class="calendar">
          <calendar
            v-if="showCalendar"
            @selected-date="selectedDone"
            use-page="form"
          ></calendar>
        </div>
      </div>
      <div>
        <span :class="{ on: state.reminder.alarm, off: !state.reminder.alarm }">
          <img
            :src="
              state.reminder.alarm
                ? '/src/image/alarm_on.png'
                : '/src/image/alarm_off.png'
            "
            alt="알람 상태"
            class="alarm"
            @click="state.reminder.alarm = !state.reminder.alarm"
          />알람 설정</span
        >
      </div>
      <div :class="{ disabled: isDateMode }">
        <span :class="{ on: isRepeatMode, off: isDateMode }">요일 반복</span>
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
          placeholder="어떤 일정이 있으신가요?"
          v-model="state.reminder.title"
        />
      </div>
      <div>
        <textarea
          name="내용"
          id="content"
          placeholder="내용을 추가해주세요!"
          v-model="state.reminder.content"
        ></textarea>
      </div>
      <button @click="submit">
        {{ state.reminder.id > 0 ? '수정하기' : '저장하기' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pickButton {
  width: 50px;
  cursor: pointer;
}
.alarm {
  width: 60px;
}
// label {
//   cursor: pointer;
//   text-indent: -9999px;
//   width: 100px;
//   height: 50px;
//   background-color: #dff7fa;
//   border-radius: 25px;
//   display: inline-block;
//   position: relative;
//   transition: 0.4s;
// }
// label::after {
//   content: '';
//   position: absolute;
//   left: 5px;
//   top: 4px;
//   width: 42px;
//   height: 42px;
//   border-radius: 50%;
//   background: #a5cace;
//   transition: 0.4s;
// }
// #toggle-slider:checked + label {
//   background: #96e7ef;
// }
// #toggle-slider:checked + label::after {
//   left: 54px;
//   background: #1d6369;
// }
// #toggle-slider {
//   display: none;
// }
.toggle-img {
  width: 60px;
  margin: 10px;
  cursor: pointer;
}
.disabled {
  opacity: 0.5;
}
.on {
  display: inline-block;
  background-color: #bfeaff;
  color: #fff;
  padding: 5px 9px;
  border-radius: 5px;
}
.off {
  color: gray;
}
</style>
