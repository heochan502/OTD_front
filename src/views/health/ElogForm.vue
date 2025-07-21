<script setup>
import { ref } from "vue";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const exerciselog = ref({
  exerciseDatetime: "",
  exercise: "",
  exerciseKcal: 0,
  exerciseDuration: 0,
  effortLevel: 0,
});
const selected = ref("");
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

const level = ref(0);

const satisfactionEmojis = [
  "\uD83D\uDE0D",
  "\uD83D\uDE04",
  "\uD83D\uDE01",
  "\uD83D\uDE0A",
  "\uD83D\uDE42",
  "\uD83D\uDE10",
  "\uD83D\uDE41",
  "\u2639\uFE0F",
  "\uD83D\uDE22",
  "\uD83D\uDE2D",
];
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="title">
      <h4>운동 기록하기</h4>
    </v-row>
    <v-row>
      <v-col>
        <div class="subtitle">운동일자</div>
        <input type="datetime-local" v-model="exerciselog.exerciseDatetime" />

        <div class="duration">
          <div class="subtitle">운동시간</div>
          <v-number-input
            control-variant="split"
            v-model="exerciselog.exerciseDuration"
            width="200px"
          ></v-number-input>
        </div>
        <div class="kcal">
          <div class="subtitle">활동에너지</div>
          <v-number-input
            control-variant="split"
            v-model="exerciselog.exerciseKcal"
            width="200px"
          ></v-number-input>
        </div>
      </v-col>
      <v-col>
        <div class="subtitle">운동</div>
        <v-select
          v-model="exerciselog.exercise"
          :items="exercise.map((e) => e.exercise)"
          variant="outlined"
        ></v-select>
        <div>
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
            {{ satisfactionEmojis[Math.min(modelValue - 1, 9)] }}
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <v-row class="buttons">
      <v-col>
        <v-btn>추가</v-btn>
        <v-btn>취소</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-content: center;

  flex-direction: column;

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
    font-size: 20px;
  }

  .buttons {
    display: flex;
  }
}
</style>
