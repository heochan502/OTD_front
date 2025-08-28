<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
import moodLevels from "@/assets/health/moodLevels.json";
import { saveHlog } from "@/services/health/hlogService";
import dayjs from "dayjs";

const router = useRouter();

const saveDialog = ref(false);
const cancelDialog = ref(false);

const state = reactive({
  form: {
    weight: null,
    height: null,
    systolicBp: null,
    diastolicBp: null,
    sugarLevel: null,
    moodLevel: null,
    sleepQuality: null,
    healthlogDatetime: "",
  },
});

const rules = [
  (value) => {
    if (value) return true;
    return "필수 입력사항입니다.";
  },
];

const convertDatetimeFormat = (input) => {
  return dayjs(input).format("YYYY-MM-DD HH:mm:ss.SSS");
};

// @click
const confirmYes = async () => {
  const jsonBody = {
    weight: state.form.weight,
    height: state.form.height,
    systolicBp: state.form.systolicBp,
    diastolicBp: state.form.diastolicBp,
    sugarLevel: state.form.sugarLevel,
    moodLevel: state.form.moodLevel,
    sleepQuality: state.form.sleepQuality,
    healthlogDatetime: convertDatetimeFormat(state.form.healthlogDatetime),
  };

  const res = await saveHlog(jsonBody);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  router.push("/health");
};

const cancelYes = () => {
  if (!confirm("취소하고 돌아가시겠습니까?")) return;
  router.push("/health");
};
</script>

<template>
  <v-container class="container pb-16" fluid>
    <v-sheet class="mx-auto w-100">
      <v-form>
        <v-row class="title">
          <h4>건강 기록하기</h4>
        </v-row>
        <v-row>
          <v-col class="left d-flex justify-center">
            <v-date-picker
              v-model="state.form.healthlogDatetime"
              min-width="310px"
              divided
            ></v-date-picker>
          </v-col>
          <v-row class="d-flex justify-center">
            <v-col class="d-flex flex-column justify-center" cols="auto">
              <v-text-field
                v-model="state.form.weight"
                :rules="rules"
                label="체중(kg)"
                variant="solo"
                class="value-field"
                density="compact"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="state.form.height"
                :rules="rules"
                label="신장"
                variant="solo"
                class="value-field"
                density="compact"
                clearable
              ></v-text-field>
              <v-select
                v-model="state.form.moodLevel"
                label="감정상태"
                :items="
                  moodLevels.map((e) => ({
                    title: e.label,
                    value: e.level,
                  }))
                "
                item-title="title"
                item-value="value"
                variant="solo"
                class="value-field"
                clearable
                density="compact"
              ></v-select>
              <v-select
                v-model="state.form.sleepQuality"
                label="수면기록"
                :items="
                  sleepQualitys.map((e) => ({
                    title: e.label,
                    value: e.level,
                  }))
                "
                item-title="title"
                item-value="value"
                variant="solo"
                class="value-field"
                clearable
                density="compact"
              ></v-select>
            </v-col>

            <v-col class="d-flex flex-column justify-center" cols="auto">
              <v-text-field
                v-model="state.form.systolicBp"
                label="수축기 혈압"
                variant="solo"
                class="value-field"
                density="compact"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="state.form.diastolicBp"
                label="이완기 혈압"
                variant="solo"
                class="value-field"
                density="compact"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="state.form.sugarLevel"
                label="혈당"
                variant="solo"
                class="value-field"
                density="compact"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
        </v-row>
        <v-row class="btns">
          <v-btn class="save" @click="saveDialog = true">저장</v-btn>
          <v-btn @click="cancelDialog = true">취소</v-btn>
        </v-row>
      </v-form>
    </v-sheet>
  </v-container>
  <!-- 모달창 -->
  <v-dialog v-model="saveDialog" max-width="400">
    <v-card>
      <v-card-title> 저장 </v-card-title>
      <v-card-text>건강 기록을 저장하시겠습니까?</v-card-text>
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

  .v-date-picker {
    $date-picker-header-height: 30px;
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

  .value-field {
    width: 50%;
    min-width: 310px;
  }
}
</style>
