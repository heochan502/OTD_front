<script setup>
import { ref } from "vue";
import effortLevels from "@/api/health/effortLevels.json";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const exerciselog = ref({
  exerciseDatetime: "",
  exercise: "",
  exerciseKcal: 0,
  exerciseDuration: 0,
  effortLevel: 1,
});
const exercise = [
  {
    id: 1,
    exercise: "수영",
    met: 10,
  },
  {
    id: 2,
    exercise: "수영",
    met: 10,
  },
  {
    id: 3,
    exercise: "수영",
    met: 10,
  },
];
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="title">
      <h4>운동 기록하기</h4>
    </v-row>
    <v-row class="content">
      <v-col cols="6">
        <div class="subtitle">운동일자</div>
        <input type="datetime-local" v-model="exerciselog.exerciseDatetime" />
        <div class="duration">
          <div class="subtitle">운동시간(분)</div>
          <v-number-input
            control-variant="split"
            v-model="exerciselog.exerciseDuration"
            width="200px"
            density="compact"
          ></v-number-input>
        </div>
        <div class="kcal">
          <div class="subtitle">활동에너지</div>
          <v-number-input
            control-variant="split"
            v-model="exerciselog.exerciseKcal"
            width="200px"
            density="compact"
          ></v-number-input>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="subtitle">운동</div>
        <v-select
          v-model="exerciselog.exercise"
          :items="exercise.map((e) => e.exercise)"
          variant="outlined"
          density="compact"
        ></v-select>
        <div style="display: flex; justify-content: space-between">
          <div class="subtitle">운동강도</div>
          <div class="text-h2 font-weight-light">
            {{ exerciselog.effortLevel }}
          </div>
        </div>
        <v-slider
          v-model="exerciselog.effortLevel"
          thumb-label="always"
          color="#3bbeff"
          track-color="E0E0E0"
          :step="1"
          min="1"
          max="10"
        >
          <template v-slot:thumb-label="{ modelValue }">
            {{ effortLevels[modelValue - 1].emoji }}
          </template>
        </v-slider>
        <div class="desbox">
          <span>
            {{ effortLevels[exerciselog.effortLevel - 1].description }}
          </span>
        </div>
      </v-col>
    </v-row>
    <v-row class="btns">
      <v-btn>추가</v-btn>
      <v-btn>취소</v-btn>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  padding-top: 100px;

  .title {
    display: flex;
    justify-content: center;
  }
  h4 {
    display: inline-block;
    border-bottom: 5px solid black;
    padding-bottom: 5px;
  }

  .subtitle {
    padding: 15px 0 3px;
    font-size: 20px;
  }
  .desbox {
    text-align: center;
    align-content: center;

    width: 300px;
    height: 50px;
    background-color: #e0e0e0;
    border-radius: 6px;

    font-size: 18px;
  }

  .btns {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}
</style>
