<script setup>
import { computed, onMounted, reactive } from "vue";
import effortLevels from "@/api/health/effortLevels.json";
import { saveElog } from "@/services/health/elogService";
import { useExerciseStore } from "@/stores/exerciseStore";
import { useRouter } from "vue-router";

const router = useRouter();
const exerciseStore = useExerciseStore();

const state = reactive({
  form: {
    exerciselogId: 0,
    exerciseId: null,
    exerciseDatetime: "",
    exerciseKcal: 0,
    exerciseDuration: 0,
    effortLevel: 1,
  },
});
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const passData = history.state.data;
onMounted(() => {
  exerciseStore.fetchExercises();
  console.log(history.state.data);
  if (passData) {
    state.form = passData;
  }
});
// click event
const submit = async () => {
  if (!confirm("저장하시겠습니까?")) {
    return;
  }
  const convertDateTimeFormat = (datetimeStr) => {
    return datetimeStr.replace("T", " ");
  };
  state.form.exerciseDatetime = convertDateTimeFormat(
    state.form.exerciseDatetime
  );
  const res = await saveElog(state.form);
  console.log(res.data);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  alert("운동 기록 저장!");
  router.push("/health");
};

const cancel = () => {
  if (!confirm("취소하고 돌아가시겠습니까?")) return;
  router.push("/health");
};
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="title">
      <h4>운동 기록하기</h4>
    </v-row>
    <v-row class="content">
      <v-col cols="6">
        <div class="subtitle">운동일자</div>
        <input
          type="datetime-local"
          id="exerciselogDatetime"
          v-model="state.form.exerciseDatetime"
        />
        <div class="duration">
          <div class="subtitle">운동시간(분)</div>
          <v-number-input
            control-variant="split"
            v-model="state.form.exerciseDuration"
            :min="0"
            width="200px"
            density="compact"
          ></v-number-input>
        </div>
        <div class="kcal">
          <div class="subtitle">활동에너지</div>
          <v-number-input
            control-variant="split"
            v-model="state.form.exerciseKcal"
            :min="0"
            width="200px"
            density="compact"
          ></v-number-input>
        </div>
      </v-col>
      <v-col cols="6">
        <!-- 운동 종목 데이터 통신 필요 -->
        <v-row>
          <div class="subtitle">운동</div>
        </v-row>
        <v-row>
          <v-select
            v-model="state.form.exerciseId"
            :items="
              exerciseStore.list.map((e) => ({
                title: e.exerciseName,
                value: e.exerciseId,
              }))
            "
            variant="solo"
            density="compact"
            placeholder="운동을 선택하세요"
            clearable
            width="274px"
          ></v-select>

          <!-- <v-icon
            icon="mdi-close-thick"
            class="cursor-pointer"
            @click="clear"
          ></v-icon> -->
        </v-row>
        <div style="display: flex; justify-content: space-between">
          <div class="subtitle">운동강도</div>
          <div class="text-h3 font-weight-light">
            {{ state.form.effortLevel }}
          </div>
        </div>
        <v-slider
          v-model="state.form.effortLevel"
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
          <p>{{ effortLevels[state.form.effortLevel - 1].label }}</p>
          <p class="description">
            {{ effortLevels[state.form.effortLevel - 1].description }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row class="btns">
      <v-btn @click="submit">추가</v-btn>
      <v-btn @click="cancel">취소</v-btn>
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
    display: flex;

    justify-content: center;

    width: 300px;
    height: 40px;
    padding: 3px 6px;
    background-color: #e0e0e0;
    border-radius: 6px;

    font-size: 18px;
    p {
      padding: 3px;
    }
    .description {
      display: flex;

      font-size: 12px;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}
</style>
