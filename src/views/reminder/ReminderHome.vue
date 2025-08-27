<script setup>
import { reactive, onMounted, watch, ref } from 'vue';
import { getByMonth } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';
import Calendar from '@/components/reminder/Calendar.vue';
import Form from '@/components/reminder/ReminderForm.vue';
import Detail from '@/components/reminder/ReminderDetail.vue';

const reminderStore = useReminderStore();

const formatNumber = (n) => String(n).padStart(2, '0');
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = formatNumber(date.getMonth() + 1);
  const d = formatNumber(date.getDate());
  return `${y}-${m}-${d}`;
};

const selectedDate = () => {
  const y = new Date(reminderStore.state.selectedDate).getFullYear();
  const m = new Date(reminderStore.state.selectedDate).getMonth() + 1;
  const d = new Date(reminderStore.state.selectedDate).getDate();
  return `${y}년 ${m}월 ${d}일`;
};
const today = new Date();

const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;

const state = reactive({
  reminderDate: [], // 한달치 리마인더 날짜
  todayReminder: [], // 오늘 리마인더 미리보기 내용
});

onMounted(async () => {
  getReminderList({ year: todayYear, month: todayMonth });
  reminderStore.setSelectedDate(formatDate(today));
  // mounted될 때 마다 리셋될 초기 리마인더(오늘 날짜) 정보 업데이트
  const todayReminder = filterReminder(today);
  console.log('dhsmf', todayReminder);
  state.todayReminder = todayReminder;
});

// watch(
//   () => reminderStore.reload,
//   (data) => {
//     if (data) {
//       getReminderList({ year: todayYear, month: todayMonth });
//       reminderStore.setReload(false);
//     }
//   }
// );

// 한달치 리마인더 목록(요일반복 포함) 조회
const getReminderList = async (date) => {
  const res = await getByMonth(date.year, date.month);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  reminderStore.setFullReminder(res.data);
  console.log('d', res.data);
  const fixedDateList = res.data
    .filter((item) => {
      if (!item.repeat) {
        return item.startDate;
      }
    })
    .map((item) => item.startDate);

  const repeatDateList = getRepeatDate(res.data, date.year, date.month);

  const merge = Array.from(new Set([...fixedDateList, ...repeatDateList]));
  state.reminderDate = merge;
  console.log('테', state.reminderDate);
};

// 요일 반복 리마인더 해당 요일 날짜로 변환 로직
const getRepeatDate = (fullReminder, year, month) => {
  console.log('full', fullReminder);
  const result = [];
  const end = new Date(year, month, 0).getDate();

  for (let day = 1; day <= end; day++) {
    const date = new Date(year, month - 1, day);
    const formattedDate = formatDate(date);
    const dow = date.getDay();
    for (const item of fullReminder) {
      if (
        item.repeat &&
        item.repeatDow?.includes(dow) &&
        item.startDate <= formattedDate &&
        (!item.endDate || item.endDate >= formattedDate)&&
        !item.exceptionDate?.includes(formattedDate)
      ) {
        result.push(formattedDate);
      }
    }
  }
  console.log('result', result);
  return result;
};

// 하루치 리마인더 정보 필터링 로직
const filterReminder = (date) => {
  const dow = date.getDay();
  const formattedDate = formatDate(date);
  const reminderList = reminderStore.state.fullReminder.filter((item) => {
    const isFixed =
      item.repeat === false && item.startDate === formattedDate;

    const isRepeat =
      item.repeat &&
      item.repeatDow?.includes(dow) &&
      item.startDate <= formattedDate &&
      (!item.endDate || item.endDate >= formattedDate)&&
      !item.exceptionDate?.includes(formattedDate);

    return isFixed || isRepeat;
  });
  return reminderList;
};

// 캘린더 날짜 선택시의 표출할 리마인더 날짜 정보 피니아 업데이트, 리마인더 내용 업데이트
const routerDate = (date) => {
  const dayReminder = filterReminder(date);
  console.log('day', dayReminder);
  state.todayReminder = dayReminder;
  reminderStore.setSelectedDate(formatDate(date));
};

const modal = ref({ form: false, detail: false });
const openModal = (type) => {
  console.log('type', type);
  modal.value[type] = true;
};
</script>

<template>
  <div class="reminder">
    <div class="left">
      <Calendar
        @reminder-date="getReminderList"
        @click-date="routerDate"
        :reminder-date="state.reminderDate"
        use-page="home"
      ></Calendar>
    </div>
    <div class="right">
      <div class="add">
        <button @click="openModal('form')" class="add-button">
          일정 추가하기
          <v-dialog v-model="modal.form" max-width="300px">
            <Form @form-close="modal.form = false"></Form>
          </v-dialog>
        </button>
      </div>

      <div class="preview">
        <div class="block">
          <span class="list-title">리마인더</span>
          <span class="list-date"> {{ selectedDate() }}</span>
          <ul v-if="state.todayReminder.length > 0" class="list">
            <li
              v-for="item in state.todayReminder"
              :key="item.id"
              class="list-card"
              @click="openModal('detail')"
              @detail-close="modal.detail = false"
            >
              <span class="reminder-title">• {{ item.title }}</span>
              <v-dialog v-model="modal.detail" max-width="300px">
                <Detail
                  :date="reminderStore.state.selectedDate"
                  :id="item.id"
                  @detail-close="modal.detail = false"
                >
                </Detail>
              </v-dialog>
            </li>
          </ul>
          <div v-else class="empty-block" @click="openModal('form')">
            <span class="empty-comment"> "등록된 일정이 없어요!"</span>
            <v-dialog v-model="modal.form" max-width="300px">
              <Form @form-close="modal.form = false"></Form>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reminder {
  display: flex;
  gap: 40px;

  .left {
    margin-left: 30px;
  }
  .right {
    margin-top: 69px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    .add {
      width: 135px;
      height: 43px;
      background-color: #3bbeff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 25px;
      margin-right: 13px;
      .add-button {
        color: #fff;
        outline: none;
        font-weight: bold;
        font-size: 17px;
      }
      .add-button:hover {
        background-color: #3bbeff;
      }
    }
    .modal-wrap {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);

      .modal-container {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 550px;
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-sizing: border-box;
        z-index: 99999999;
      }
    }
    .preview {
      border-radius: 20px;
      background-color: #bfeaff;
      width: 358px;
      height: 486px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      .block {
        margin: 35px;
        height: 418px;
        position: relative;
        max-height: 418px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none;
        }

        .list-title {
          color: #fff;
          font-weight: bold;
          font-size: 20px;
        }

        .list-date {
          margin: -3px 0 25px 1px;
          display: block;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }

        .list {
          list-style: none;
          padding: 0;

          .list-card {
            width: 100%;
            height: 45px;
            background-color: #fff;
            margin-bottom: 8px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            cursor: pointer;

            .reminder-title {
              color: #575757;
              margin-left: 15px;
              font-weight: bold;
            }
          }
        }
        .empty-block {
          position: relative;
          width: 100%;
          height: 80%;

          .empty-comment {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: inline-block;
            color: #575757;
            font-weight: bold;
            font-size: 20px;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
