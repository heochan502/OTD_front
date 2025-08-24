<script setup>
import { reactive, onMounted, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getByMonth } from '@/services/reminder/reminderService';
import { useReminderStore } from '@/stores/reminderStore';
import Calendar from '@/components/reminder/Calendar.vue';
import Form from '@/components/reminder/ReminderForm.vue';
import Detail from '@/components/reminder/ReminderDetail.vue';

const reminderStore = useReminderStore();

const router = useRouter();

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
const todayDate = today.getDate();

const state = reactive({
  reminderDate: [], // 한달치 리마인더 날짜
  todayReminder: [], // 오늘 리마인더 미리보기 내용
});

onMounted(async () => {
  getReminderList({ year: todayYear, month: todayMonth });
  reminderStore.setSelectedDate(formatDate(today));
});

watch(
  () => reminderStore.reload,
  (data) => {
    if (data) {
      getReminderList({ year: todayYear, month: todayMonth });
      reminderStore.setReload(false);
    }
  }
);

// 한달치 리마인더 목록(요일반복 포함) 조회
const getReminderList = async (date) => {
  const res = await getByMonth(date.year, date.month);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  reminderStore.setFullReminder(res.data);

  const fixedDateList = res.data
    .filter((item) => item.startDate)
    .map((item) => item.startDate);

  const repeatDateList = getRepeatDate(res.data, date.year, date.month);

  const merge = Array.from(new Set([...fixedDateList, ...repeatDateList]));
  state.reminderDate = merge;
  setTodayReminder(date);
};

// 요일 반복 리마인더 해당 요일 날짜로 변환 로직
const getRepeatDate = (fullReminder, year, month) => {
  const result = [];
  const end = new Date(year, month, 0).getDate();

  for (let day = 1; day <= end; day++) {
    const date = new Date(year, month - 1, day);
    const dow = date.getDay();
    for (const item of fullReminder) {
      if (item.repeat && item.repeatDow?.includes(dow)) {
        const created = new Date(item.created);
        if (date >= created) {
          result.push(formatDate(date));
          break;
        }
      }
    }
  }
  // console.log('result', result);
  return result;
};

// 캘린더 날짜 클릭시 해당 날짜의 리마인더 정보 업데이트
const setTodayReminder = (date) => {
  const todayDow = today.getDay();
  const todayReminder = reminderStore.state.fullReminder.filter((item) => {
    return (
      item.startDate === formatDate(new Date()) ||
      (item.repeat && item.repeatDow?.includes(todayDow))
    );
  });
  if (date.month === todayMonth && date.year === todayYear) {
    state.todayReminder = todayReminder;
  }
  // reminderStore.setDayReminder(todayReminder);
};

// 캘린더 날짜 선택시의 홈, 폼 router 분기문
const routerDate = (date) => {
  const formattedDate = formatDate(date);
  const dow = date.getDay();
  const dayReminder = reminderStore.state.fullReminder.filter((item) => {
    const isFixed = item.startDate === formattedDate;

    const isRepeat =
      item.repeat &&
      item.repeatDow?.includes(dow) &&
      new Date(formattedDate) >= new Date(item.created);

    return isFixed || isRepeat;
  });

  state.todayReminder = dayReminder;
  reminderStore.setSelectedDate(date);
};

const toForm = (param) => {
  if (typeof param === 'number') {
    router.push({ path: '/reminder/detail', query: { id } });
  } else if (typeof param === 'string') {
    router.push({ path: '/reminder/form', query: { id } });
  }
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
            <Form></Form>
          </v-dialog>
        </button>
      </div>

      <div class="preview">
        <div class="block">
          <div class="link">
            <span class="list-title">리마인더</span>
            <span class="list-date"> {{ selectedDate() }}</span>
            <ul v-if="state.todayReminder.length > 0" class="list">
              <li
                v-for="item in state.todayReminder"
                :key="item.id"
                class="list-card"
                @click="openModal('detail')"
              >
                <span class="reminder-title">• {{ item.title }}</span>
                <v-dialog v-model="modal.detail">
                  <Detail
                    :date="reminderStore.state.selectedDate"
                    :id="item.id"
                  >
                  </Detail>
                </v-dialog>
              </li>
            </ul>
            <div v-else class="empty-comment" @click="toForm()">
              "등록된 일정이 없어요!"
            </div>
          </div>
          <!-- </router-link> -->
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
      }

      .empty-comment {
        position: absolute;
        top: 50%;
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
</style>
