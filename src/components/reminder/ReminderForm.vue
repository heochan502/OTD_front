<script setup>
import { ref, computed, reactive } from 'vue';
import Calendar from './Calendar.vue';

const state = reactive({
  title: '',
  content: '',
  date: '',
  repeat: false,
  repeatDow: '',
  alarm: false,
});

const showCalendar = ref(false);
const selectedDate = ref(new Date());

const selectedDone = (date) => {
  selectedDate.value = date;
  showCalendar.value = false;
};

const formattedDate = computed(() => {
  if (!selectedDate.value) return '날짜를 선택하세요';
  const y = selectedDate.value.getFullYear();
  const m = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
  const d = String(selectedDate.value.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d}`;
});

const dowImage = ref([
  { name: '월', key: 'mon', isOn: false },
  { name: '화', key: 'tue', isOn: false },
  { name: '수', key: 'wed', isOn: false },
  { name: '목', key: 'thu', isOn: false },
  { name: '금', key: 'fri', isOn: false },
  { name: '토', key: 'sat', isOn: false },
  { name: '일', key: 'sun', isOn: false },
]);
const imageToggle = (index) => {
  dowImage.value[index].isOn = !dowImage.value[index].isOn;
};
</script>

<template>
  <div>
    <h2>리마인더 추가하기</h2>
    <div>
      <div>
        <span title="취소"></span>
      </div>
      <div>
        <span>{{ formattedDate }}</span>
        <img
          src="/src/image/button.png"
          alt="날짜 선택하기"
          @click="showCalendar = !showCalendar"
          class="pickButton"
        />
        <calendar v-if="showCalendar" @selected-date="selectedDone"></calendar>
      </div>
      <div>
        <img
          v-if="isOn"
          src="/src/image/alarm_on.png"
          alt="알람허용"
          @click="imageToggle"
        />
        <img
          v-else
          src="/src/image/alarm_off.png"
          alt="알람비허용"
          class="alarm"
          @click="imageToggle"
        />
        <span class="toggle">
          <input type="checkbox" id="toggle-slider" />
          <label for="toggle-slider">On/Off</label>
        </span>
      </div>
      <div>
        <img
          v-for="(dow, index) in dowImage"
          :key="index"
          :src="`/src/image/${dow.key}_${dow.isOn ? 'on' : 'off'}.png`"
          :alt="요일"
          @click="imageToggle(index)"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="어떤 일정이 있으신가요?"
          v-model="state.title"
        />
      </div>
      <div>
        <textarea
          name="내용"
          id="content"
          placeholder="내용을 추가해주세요!"
          v-model="state.content"
        ></textarea>
      </div>
      <button>저장하기</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pickButton {
  width: 50px;
}
.alarm {
  width: 60px;
}
label {
  cursor: pointer;
  text-indent: -9999px;
  width: 100px;
  height: 50px;
  background-color: #dff7fa;
  border-radius: 25px;
  display: inline-block;
  position: relative;
  transition: 0.4s;
}
label::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 4px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #a5cace;
  transition: 0.4s;
}
#toggle-slider:checked + label {
  background: #96e7ef;
}
#toggle-slider:checked + label::after {
  left: 54px;
  background: #1d6369;
}
#toggle-slider {
  display: none;
}
</style>
