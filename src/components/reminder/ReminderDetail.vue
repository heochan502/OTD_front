<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';
import {
  deleteById,
  modifyException,
  saveException,
} from '@/services/reminder/reminderService';
import Form from '@/components/reminder/ReminderForm.vue';

const reminderStore = useReminderStore();
const emit = defineEmits('datail-close');

const props = defineProps({
  id: { type: Number },
});

const state = reactive({
  reminderDetail: [],
});

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
  const reminderDetail = reminderStore.state.fullReminder.find(
    (item) => item.id === props.id
  );
  state.reminderDetail = reminderDetail;
  console.log('detail', state.reminderDetail);
  if (state.reminderDetail.repeat) {
    dowImage.value.forEach((item, index) => {
      item.isOn = state.reminderDetail.repeatDow.includes(index);
    });
    console.log('isOn', dowImage.value);
  }
});

const modal = ref({ form: false, delete: false });

const openModal = (type) => {
  modal.value[type] = true;
};

const close = (type) => {
  modal.value[type] = false;
  if (type === 'modify' || type === 'detail') {
    emit('detail-close');
  }
};

const deleteScope = ref('one');
const deleteDate = ref(reminderStore.state.selectedDate);

const remove = async (id) => {
  let res = null;
  if (!confirm('일정을 삭제할까요?')) {
    return;
  }
  if (!state.reminderDetail.repeat || deleteScope.value === 'all') {
    res = await deleteById(id);
  }
  if (state.reminderDetail.repeat) {
    if (deleteScope.value === 'one') {
      const jsonbody = { id: id, exceptionDate: deleteDate.value };
      console.log(jsonbody)
      res = await saveException(jsonbody);
    }
    if (deleteScope.value === 'future') {
      const jsonBody = { id: id, endDate: deleteDate.value };
      res = await modifyException(jsonBody);
    }
  }
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  alert('일정을 삭제했어요!');
  emit('detail-close');
};

</script>

<template>
  <div class="detail">
    <div class="detail-card">
      <h2 class="detail-title">리마인더 자세히 보기</h2>
      <div class="cancel">
        <span class="cancel-button" @click="close('detail')">
          <img src="/image/cancel.png" alt="취소" class="cancel-img" />
        </span>
      </div>
      <div>
        <span class="date-box">날짜</span>
        <span class="date">{{ reminderStore.state.selectedDate }}</span>
      </div>
      <span
        class="alarm-box"
        :class="{
          on: state.reminderDetail.alarm,
          off: !state.reminderDetail.alarm,
        }"
      >
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
      <span>
        <span
          :class="{ on: state.reminderDetail.repeat }"
          class="off toggle-box"
          >{{ !state.reminderDetail.repeat ? '반복 없음' : '요일 반복' }}
          <span v-if="state.reminderDetail.repeat">
            {{
              state.reminderDetail.endDate
                ? ` | 종료일 : ${state.reminderDetail.endDate}`
                : ' | 종료일 없음'
            }}</span
          >
        </span>
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
        <div>제목</div>
        <div>{{ state.reminderDetail.title }}</div>
      </div>
      <div v-if="state.reminderDetail.content">
        <div>내용</div>
        <div>{{ state.reminderDetail.content }}</div>
      </div>
      <div>
        <button @click="openModal('form')">
          수정하기
          <v-dialog v-model="modal.form" max-width="300px">
            <Form @form-close="close" :id="state.reminderDetail.id"></Form>
          </v-dialog></button
        ><button
          @click="
            state.reminderDetail.repeat
              ? openModal('delete')
              : remove(state.reminderDetail.id)
          "
        >
          삭제하기
          <v-dialog v-model="modal.delete" max-width="360">
            <v-card>
              <v-card-title>반복 일정 삭제</v-card-title>
              <v-card-text>
                <v-radio-group v-model="deleteScope" density="compact">
                  <v-radio label="이 일정" value="one" />
                  <v-radio label="이 일정 및 향후 일정" value="future" />
                  <v-radio label="모든 일정" value="all" />
                </v-radio-group>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="modal.delete = false">취소</v-btn>
                <v-btn color="primary" @click="remove(state.reminderDetail.id)"
                  >삭제</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  width: 400px;
  margin: 80px auto;
  background-color: transparent;

  .detail-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #000;
    margin-bottom: 25px;
  }

  .detail-card {
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
