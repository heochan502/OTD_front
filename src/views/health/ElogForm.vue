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
  <v-container fulid>
    <h4 class="title">운동 기록하기</h4>
    <form class="form_elog">
      <div class="form_elog_left">
        <div class="exercise_date">
          <div class="subtitle">운동일자</div>
          <input type="datetime-local" v-model="exerciselog.exerciseDatetime" />
        </div>
        <div class="duration">
          <div class="subtitle">운동시간</div>
          <v-number-input
            control-variant="split"
            v-model="exerciselog.exerciseDuration"
          ></v-number-input>
        </div>
        <div class="kcal">
          <div class="subtitle">활동에너지</div>
          <v-number-input
            control-variant="split"
            v-model="exerciselog.exerciseKcal"
          ></v-number-input>
        </div>
      </div>
      <div class="form_elog_right">
        <div class="exercise">
          <div class="subtitle">운동</div>
          <v-select
            v-model="exerciselog.exercise"
            :items="exercise.map((e) => e.exercise)"
            variant="outlined"
          ></v-select>
        </div>
        <div class="effort_level">
          <div class="subtitle">운동강도</div>
          <div>
            <span class="text-h2 font-weight-light">{{
              exerciselog.effortLevel
            }}</span>
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
          </div>
        </div>
      </div>
    </form>
    <div class="btn">
      <div>추가</div>
      <div>취소</div>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  padding-top: 20px;
  text-align: center;
  justify-content: center;
  h4 {
    display: inline-block;
    margin-bottom: 50px;
    padding-bottom: 5px;
    border-bottom: 5px solid black;
  }
  .form_elog {
    display: flex;
    justify-content: center;
    text-align: left;
    gap: 50px;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
