<script setup>
import { onMounted, reactive, ref } from "vue";
import effortLevels from "@/assets/health/effortLevels.json";
import { saveElog } from "@/services/health/elogService";
import { useExerciseStore } from "@/stores/exerciseStore";
import { useRouter } from "vue-router";

const router = useRouter();
const exerciseStore = useExerciseStore();

const saveDialog = ref(false);
const cancelDialog = ref(false);

const state = reactive({
  form: {
    exerciseId: null,
    exerciseDatetime: "",
    exerciseKcal: 0,
    exerciseDuration: 0,
    effortLevel: 1,
  },
});


onMounted(() => {
  exerciseStore.fetchExercises();
});

// click event
// 기록 저장
const confirmYes = async () => {
  const convertDatetimeFormat = (datetimeStr) => {
    return datetimeStr.replace("T", " ");
  };

  const jsonBody = {
    exerciseId: state.form.exerciseId,
    exerciseDatetime: convertDatetimeFormat(state.form.exerciseDatetime),
    exerciseKcal: state.form.exerciseKcal,
    exerciseDuration: state.form.exerciseDuration,
    effortLevel: state.form.effortLevel,
  };

  const res = await saveElog(jsonBody);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  router.push("/health");
};

const cancelYes = () => {
  router.push("/health");
};
</script>

<template>
  <v-container class="container" fluid>
    <div class="title">
      <h4>운동 기록하기</h4>
    </div>
    <v-row class="content d-flex justify-center">
      <v-col cols="12" sm="6" class="d-flex flex-column">
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
      <v-col cols="12" sm="6">
        <!-- 운동 종목 데이터 통신 필요 -->
        <v-row>
          <div class="subtitle">운동</div>
        </v-row>
        <v-row>
          <v-select
            v-model="state.form.exerciseId"
            :items="
              exerciseStore.exerciseList.map((e) => ({
                title: e.exerciseName,
                value: e.exerciseId,
              }))
            "
            variant="solo"
            density="compact"
            placeholder="운동을 선택하세요"
            clearable
            max-width="274px"
          ></v-select>

          <!-- <v-icon
            icon="mdi-close-thick"
            class="cursor-pointer"
            @click="clear"
          ></v-icon> -->
        </v-row>
        <div style="display: flex; justify-content: space-between">
          <div class="subtitle">운동강도</div>
          <div class="text-h4 text-md-h3 font-weight-light">
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
          max-width="274px"
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
      <v-btn class="save" @click="saveDialog = true">저장</v-btn>
      <v-btn @click="cancelDialog = true">취소</v-btn>
    </v-row>
  </v-container>
  <!-- 모달창 -->
  <v-dialog v-model="saveDialog" max-width="400">
    <v-card>
      <v-card-title> 저장 </v-card-title>
      <v-card-text>운동 기록을 저장하시겠습니까?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="dark" text @click="saveDialog = false">취소</v-btn>
        <v-btn color="primary" text @click="confirmYes">저장</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="cancelDialog" max-width="400">
    <v-card>
      <v-card-title> 취소 </v-card-title>
      <v-card-text
        >기록을 저장하지 않고 건강 메인화면으로 돌아가시겠습니까?</v-card-text
      >
      <v-card-actions>
        <v-spacer />
        <v-btn color="dark" text @click="cancelDialog = false">취소</v-btn>
        <v-btn color="primary" text @click="cancelYes">이동</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  .title {
    display: flex;
    justify-content: center;
    h4 {
      display: inline-block;
      border-bottom: 5px solid black;
      padding-bottom: 5px;
    }
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
    .v-btn {
      height: 30px;
      border-radius: 20px;
      background-color: #838383;
      color: #fff;
    }
    .save {
      background-color: #3bbeff;
    }
  }
}
</style>
