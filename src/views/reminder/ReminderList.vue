<script setup>
import { reactive, onMounted } from 'vue';
import { useReminderStore } from '@/stores/reminderStore';
import { useRouter, useRoute } from 'vue-router';
import { deleteById } from '@/services/reminder/reminderService';
import { getByMonth } from '@/services/reminder/reminderService';

const router = useRouter();

const reminderStore = useReminderStore();

const state = reactive({
  reminder: [],
});

const selectedDate = reminderStore.state.selectedDate;
const year = Number(selectedDate.split('-')[0]);
const month = Number(selectedDate.split('-')[1]);
const dow = new Date(selectedDate).getDay();

const getReminderList = async (year, month) => {
  const res = await getByMonth(year, month);
  if (res === undefined || res.status !== 200) {
    alert('리마인더 목록을 불러오는 데 실패했어요!');
    return;
  }

  reminderStore.setFullReminder(res.data);

  state.reminder = res.data.filter((item) => {
    const isFixed = item.date === selectedDate;
    const isRepeat =
      item.repeat &&
      item.repeatDow?.includes(dow) &&
      new Date(selectedDate) >= new Date(item.created);
    return isFixed || isRepeat;
  });
};

onMounted(async () => {
  if (selectedDate) {
    await getReminderList(year, month);
  } else {
    state.reminder = reminderStore.state.dayReminder;
    reminderStore.setDayReminder([]);
  }
});

const dowImage = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const contentBtn = reactive({});

const viewDetail = (id) => {
  contentBtn[id] = !contentBtn[id];
};

const remove = async (id) => {
  if (!confirm('이 일정을 삭제할까요?')) {
    return;
  }
  const res = await deleteById(id);
  if (res === undefined || res.status !== 200) {
    alert('오류발생');
    return;
  }
  alert('일정을 삭제했어요!');
  await getReminderList(year, month);
  if (state.reminder.length === 0) {
    router.push('/reminder');
  }
};

const modify = (id) => {
  router.push({ path: '/reminder/form', query: { id } });
};
</script>
<template>
  <div>
    <div class="reminder-add">
      <router-link to="/reminder/form" class="add">일정 추가하기</router-link>
    </div>
    <ul class="reminder">
      <template v-for="reminder in state.reminder" :key="reminder.id">
        <div class="list-wrap">
          <li class="list">
            <div class="contents">
              <div class="left">
                <span class="title">• {{ reminder.title }}</span>
              </div>
              <div class="right">
                <div class="date-info">
                  <div class="date-img">
                    <img
                      v-for="(dow, index) in dowImage"
                      :key="dow"
                      :src="`/src/assets/image/${dow}_${
                        reminder.repeat && reminder.repeatDow.includes(index)
                          ? 'on'
                          : 'off'
                      }.png`"
                      :alt="dow"
                      class="img"
                    />
                  </div>
                  <div class="date-wrap">
                    <span v-if="reminder.date" class="date">{{
                      reminder.date
                    }}</span>
                    <span v-else class="date">요일 반복</span>
                  </div>
                  <img
                    :src="
                      reminder.alarm
                        ? '/src/assets/image/alarm_on.png'
                        : '/src/assets/image/alarm_off.png'
                    "
                    alt="알람 유무"
                    class="img alarm"
                  />
                  <img
                    :class="{
                      'button-hide':
                        reminder.content === '' || reminder.content === null,
                    }"
                    src="/src/assets/image/button.png"
                    alt="상세보기"
                    @click="viewDetail(reminder.id)"
                    class="img detail"
                  />
                </div>
              </div>
            </div>
            <div class="content-text" v-if="contentBtn[reminder.id]">
              {{ reminder.content }}
            </div>
          </li>
          <div class="edit">
            <img
              src="/src/assets/image/delete.png"
              alt="삭제"
              @click="remove(reminder.id)"
              class="img"
            />
            <img
              src="/src/assets/image/modify.png"
              alt="수정"
              @click="modify(reminder.id)"
              class="img"
            />
          </div>
        </div>
      </template>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.list-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  .edit {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}

.list {
  background-color: #bfeaff;
  list-style: none;
  border-radius: 5rem;
  font-size: 1.2rem;
  font-weight: 500;
  width: 93%;
  padding: 18px;
}
.contents {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 16px;

  .left {
    display: flex;
    align-items: center;

    .title {
      color: #575757;
      font-size: 1.6rem;
      font-weight: bold;
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .right {
    display: flex;
    align-items: flex-end;
    gap: 12px;

    .date-info {
      display: flex;
      align-items: center;
      gap: 16px;

      .date-img {
        display: flex;
        gap: 10px;
        margin-right: 10px;
      }

      img {
        width: 35px;
        height: 35px;
      }
    }
  }
}
.date-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;

  .date {
    color: #575757;
    font-size: 1rem;
    white-space: nowrap;
  }
}

.img {
  width: 28px;
  height: 28px;
}

.detail {
  transform: rotate(90deg);
  cursor: pointer;
}

.reminder-add {
  display: flex;
  flex-direction: row-reverse;
  max-width: 93%;

  .add {
    width: 135px;
    height: 43px;
    background-color: #3bbeff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    color: #fff;
    font-weight: bold;
    font-size: 17px;
    margin-bottom: 12px;
  }
}
.content-text {
  color: #575757;
  margin-left: 30px;
}

.button-hide {
  visibility: hidden;
}
</style>
