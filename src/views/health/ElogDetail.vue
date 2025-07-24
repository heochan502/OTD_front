<script setup>
import { onMounted, reactive } from "vue";
import effortLevels from "@/api/health/effortLevels.json";
import { getElog } from "@/services/health/elogService";
import { useExerciseStore } from "@/stores/exerciseStore";
import { useRoute, useRouter } from "vue-router";

const exerciseStore = useExerciseStore();
const route = useRoute();
const router = useRouter();

const state = reactive({
  elog: {
    exerciselogId: 0,
    exerciseId: 0,
    exerciseDatetime: "",
    exerciseKcal: 0,
    exerciseDuration: 0,
    effortLevel: 0,
  },
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  // const hour = String(date.getHours().padStart(2, "0"));
  // const minutes = String(date.getMinutes().padStart(2, "0"));

  return `${date.getHours()}시 ${date.getHours()}분`;
};

onMounted(async () => {
  exerciseStore.fetchExercises();
  const exerciselogId = route.params.exerciselogId;
  console.log(exerciselogId);
  const res = await getElog(exerciselogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  state.elog = res.data;
});

// @click
const updateLog = () => {
  const json = JSON.stringify(state.elog);
  router.push({
    path: "/elog/form",
    state: {
      data: json,
    },
  });
};
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="top">
      <div class="exercise_datetime">
        {{ formatDate(state.elog.exerciseDatetime) }}
      </div>
      <div class="btns">
        <v-btn class="btn_modify" @click="updateLog">수정</v-btn>
        <v-btn class="btn_delete" @click="deleteLog">삭제</v-btn>
      </div>
    </v-row>
    <v-row class="align-center">
      <v-col class="col_left">
        <div class="exercise">
          <span>
            {{ exerciseStore.list[state.elog.exerciseId]?.exerciseName }}
          </span>
        </div>
      </v-col>
      <v-col class="col_right">
        <v-row>
          <v-col>
            <div class="subtitle">운동시작</div>
            <div class="content">
              {{ formatTime(state.elog.exerciseDatetime) }}
            </div>
          </v-col>
          <v-col>
            <div class="subtitle">운동시간</div>
            <div class="content">{{ state.elog.exerciseDuration }} 분</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="subtitle">활동에너지</div>
            <div class="content">{{ state.elog.exerciseKcal }} kcal</div>
          </v-col>
          <v-col>
            <div class="subtitle">운동강도</div>
            <div class="content">
              {{ effortLevels[state.elog.effortLevel].label }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  padding: 80px;
}
.top {
  display: flex;
  justify-content: space-between;
  padding: 20px 10px 50px;
  .exercise_datetime {
    font-size: 25px;
    font-weight: 600;
  }
}
.col_left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .exercise {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180px;
    width: 180px;
    background-color: #3bbeff;
    border-radius: 50%;
    span {
      text-align: center;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
    }
  }
}

.col_right {
  display: flex;
  flex-direction: column;

  .subtitle {
    font-size: 18px;
  }
  .content {
    font-size: 24px;
    font-weight: 500;
  }
}
.btns {
  display: flex;
  gap: 5px;
}
.v-btn {
  height: 30px;
  border-radius: 20px;
  color: #fff;
}
.btn_modify {
  background-color: #3bbeff;
}
.btn_delete {
  background-color: #838383;
}
</style>
