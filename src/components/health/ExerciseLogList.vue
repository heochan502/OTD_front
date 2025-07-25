<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useExerciseStore } from "@/stores/exerciseStore";

const router = useRouter();
const exerciseStore = useExerciseStore();

// 응답받은 기록들
const state = reactive({
  logs: [],
});

// 운동기록불러오기
// const load = async () => {
//   const res = await getElogs();
//   if (res === undefined || res.status !== 200) {
//     alert(res.status + "오류발생!");
//     return;
//   }
//   state.logs = res.data;
// };

onMounted(async () => {
  await exerciseStore.fetchExercises();
  await exerciseStore.fetchExerciselogs();
  state.logs = exerciseStore.logs;
});

// 날짜 형식 변경
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// click event
const detail = (exerciselogId) => {
  router.push(`/elog/${exerciselogId}`);
};
const add = () => {
  router.push("/elog/form");
};
</script>

<template>
  <div class="list_title">
    <div>운동기록</div>
    <div>
      <i class="bi bi-plus-circle btn-plus" @click="add"></i>
    </div>
  </div>
  <ul>
    <li v-if="state.logs.length < 1" class="title">운동 기록을 추가하세요</li>
    <li
      v-for="item in state.logs"
      :key="item.exerciselogId"
      @click="detail(item.exerciselogId)"
    >
      <div class="title">
        {{ exerciseStore.list[item.exerciseId - 1]?.exerciseName }}
      </div>
      <div class="content">
        <div>{{ item.exerciseDuration }}분</div>
        <div>
          {{ formatDate(item.exerciseDatetime) }}
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.list_title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 5px;

  div {
    font-size: 20px;
    font-weight: 600;
  }

  .btn-plus {
    cursor: pointer;
  }
}

ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 400px;
    height: 80px;
    margin: 10px 0;
    padding: 5px 40px;
    border-radius: 40px;
    background-color: #3bbeff;
    cursor: pointer;
  }
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;

  color: #fff;
}
</style>
