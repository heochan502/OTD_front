<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
import moodLevels from "@/assets/health/moodLevels.json";

const router = useRouter();

const state = reactive({
  logs: {
    weight: null,
    height: null,
    systolic_bp: null,
    diastolic_bp: null,
    sugar_level: null,
    mood_lebel: null,
    sleep_quality: null,
    healthlog_datetime: null,
  },
});

const rules = [
  (value) => {
    if (value) return true;
    return "필수 입력사항입니다.";
  },
];

// @click
const submit = () => {
  alert("추후 구현 예정");
};
const cancel = () => {
  if (!confirm("취소하고 돌아가시겠습니까?")) return;
  router.push("/health");
};
</script>

<template>
  <v-container class="container" fluid>
    <v-sheet class="mx-auto" width="1000">
      <v-form>
        <v-row class="title">
          <h4>건강 기록하기</h4>
        </v-row>
        <v-row class="hlogForm">
          <v-col class="left">
            <v-date-picker
              v-model="state.logs.healthlog_datetime"
              width="300px"
              divided
              landscape
            ></v-date-picker>
          </v-col>
          <v-col class="right" cols="8">
            <v-row>
              <v-text-field
                v-model="state.logs.weight"
                :rules="rules"
                label="체중(kg)"
                variant="solo"
                class="pa-2"
                density="compact"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="state.logs.height"
                :rules="rules"
                label="신장"
                variant="solo"
                class="pa-2"
                density="compact"
                clearable
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                v-model="state.logs.systolic_bp"
                label="최저 혈압"
                variant="solo"
                class="pa-2"
                density="compact"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="state.logs.diastolic_bp"
                label="최고 혈압"
                variant="solo"
                class="pa-2"
                density="compact"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="state.logs.sugar_level"
                label="혈당"
                variant="solo"
                class="pa-2"
                density="compact"
                clearable
              ></v-text-field>
            </v-row>
            <v-row>
              <v-combobox
                v-model="state.logs.mood_lebel"
                label="감정상태"
                :items="
                  moodLevels.map((e) => ({
                    title: e.label,
                    value: e.level,
                  }))
                "
                variant="solo"
                class="pa-2"
                clearable
              ></v-combobox>
              <v-combobox
                v-model="state.logs.sleep_quality"
                label="수면기록"
                :items="
                  sleepQualitys.map((e) => ({
                    title: e.label,
                    value: e.level,
                  }))
                "
                variant="solo"
                class="pa-2"
                clearable
              ></v-combobox>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="btns">
          <v-btn class="save" @click="submit">저장</v-btn>
          <v-btn @click="cancel">취소</v-btn>
        </v-row>
      </v-form>
    </v-sheet>
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
    h4 {
      display: inline-block;
      border-bottom: 5px solid black;
      padding-bottom: 5px;
    }
  }

  .hlogForm {
    display: flex;
    flex-direction: row;
  }

  .v-date-picker {
    $date-picker-header-height: 30px;
  }

  .right {
    display: flex;
    justify-content: center;
    flex-direction: column;
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
