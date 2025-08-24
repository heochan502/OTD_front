<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const reminderStore = useReminderStore();

const state = reactive({
  reminderDetail: [],
});

const reminderId = Number(route.query.id);

const reminderDetail = reminderStore.state.fullReminder.find(
  (item) => item.id === reminderId
);
state.reminderDetail = reminderDetail;
console.log('detail', state.reminderDetail);

const dowImage = ref([
  { name: '일', key: 'sun', isOn: false },
  { name: '월', key: 'mon', isOn: false },
  { name: '화', key: 'tue', isOn: false },
  { name: '수', key: 'wed', isOn: false },
  { name: '목', key: 'thu', isOn: false },
  { name: '금', key: 'fri', isOn: false },
  { name: '토', key: 'sat', isOn: false },
]);

onMounted(() => {
  if (state.reminderDetail.repeat) {
    dowImage.value.forEach((item, index) => {
      item.isOn = state.reminderDetail.repeatDow.includes(index);
      console.log('isOn', dowImage.value);
    });
  }
});
</script>

<template>
  <div class="detail">
    <h2 class="detail-title">리마인더 자세히 보기</h2>
    <div class="detail-card">
      <span>
        <router-link to="/reminder">
          <img src="/image/cancel.png" alt="취소" class="cancel" />
        </router-link>
      </span>
      <div>
        <span class="date-box">날짜</span>
        <span class="date">
          {{ new Date(reminderStore.state.selectedDate).getFullYear() }}년
          {{ new Date(reminderStore.state.selectedDate).getMonth() + 1 }}월
          {{ new Date(reminderStore.state.selectedDate).getDate() }}일</span
        >
      </div>
      <span class="alarm-box">
        <img
          :src="
            state.reminderDetail.alarm
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
          >요일 반복 |
          {{
            state.reminderDetail.endDate
              ? state.reminderDetail.endDate
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
            class="toggle-img"
          />
        </div>
      </span>
      <div>
        {{ state.reminderDetail.title }}
      </div>
      <div>
        {{ state.reminderDetail.content }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  width: 400px;
  margin: 80px auto;
  background-color: #fff;

  .detail-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #5d5d5d;
    margin-bottom: 25px;
  }

  .detail-card {
    cursor: pointer;
    position: relative;
    border-radius: 10px;
    padding: 20px 30px 30px 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 500px;

    a {
      &:hover {
        background-color: #fff;
      }
    }
    .cancel {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .date-box {
      margin-right: 173px;
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
      margin-right: 166px;
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
