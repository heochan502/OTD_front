<script setup>
import { reactive } from "vue";
import effortLevels from "@/api/health/effortLevels.json";

const exerciselog = reactive({
  exerciselogId: 1,
  exercise: "수영",
  exerciseDatetime: "2025-07-19",
  exerciseKcal: 60,
  exerciseDuration: 40,
  effortLevel: 3,
});
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="top">
      <div class="exercise_datetime">
        {{ formatDate(exerciselog.exerciseDatetime) }}
      </div>
      <div class="btns">
        <v-btn class="btn_modify">수정</v-btn>
        <v-btn class="btn_delete">삭제</v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col class="col_left">
        <div class="exercise">
          <span>
            {{ exerciselog.exercise }}
          </span>
        </div>
      </v-col>
      <v-col class="col_right">
        <div class="subtitle">운동시간</div>
        <div class="content">{{ exerciselog.exerciseDuration }} 분</div>
        <v-row>
          <v-col>
            <div class="subtitle">활동에너지</div>
            <div class="content">{{ exerciselog.exerciseKcal }} kcal</div>
          </v-col>
          <v-col>
            <div class="subtitle">운동강도</div>
            <div class="content">
              {{ effortLevels[exerciselog.effortLevel].label }}
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
      font-size: 36px;
      font-weight: 700;
      color: #fff;
    }
  }
}

.col_right {
  .subtitle {
    font-size: 18px;
  }
  .content {
    font-size: 32px;
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
