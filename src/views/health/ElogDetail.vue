<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import effortLevels from "@/assets/health/effortLevels.json";
import { deleteElog, getElog, getElogs } from "@/services/health/elogService";
import { useExerciseStore } from "@/stores/exerciseStore";
import { useRoute, useRouter } from "vue-router";
import HealthChart from "@/components/health/HealthChart.vue";
import { formatDate, formatDate2 } from "@/utils/reportUtils";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

const exerciseStore = useExerciseStore();
const route = useRoute();
const router = useRouter();
const confirmDialog = ref(false); // 모달에 사용됨
dayjs.extend(isoWeek);

const state = reactive({
  elog: {
    exerciselogId: 0,
    exerciseId: null,
    exerciseDatetime: "",
    exerciseKcal: 0,
    exerciseDuration: 0,
    effortLevel: 1,
  },
  weeklyLogs: [],
});

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  // const hour = String(date.getHours().padStart(2, "0"));
  // const minutes = String(date.getMinutes().padStart(2, "0"));

  return `${date.getHours()}시 ${date.getHours()}분`;
};

const exerciseLogId = route.params.exerciselogId; // 쿼리스트링으로 id 값 받기

onMounted(async () => {
  if (!exerciseLogId) return;
  const res = await getElog(exerciseLogId); // 운동기록 데이터 받기

  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }

  state.elog = res.data;
});

// @click
const moveToMain = () => {
  router.push({
    path: "/health",
  });
};

const confirmYes = async () => {
  const exerciselogId = state.elog.exerciselogId;
  const res = await deleteElog(exerciselogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  router.push("/health");
};

watch(state, async () => {
  // 해당주차범위
  const params = computed(() => {
    const base = dayjs(state.elog.exerciseDatetime);
    const weekRange = {
      startDate: base.startOf("isoWeek"),
      endDate: base.endOf("isoWeek"),
    };
    return {
      start_date: formatDate2(weekRange.startDate),
      end_date: formatDate2(weekRange.endDate),
    };
  });

  const res = await getElogs(params.value);
  state.weeklyLogs = res.data;
});
</script>

<template>
  <v-container fluid>
    <v-row class="top">
      <div class="exercise_datetime text-h6 text-sm-h5">
        {{ formatDate(state.elog.exerciseDatetime) }}
      </div>
      <div class="btns d-none d-md-flex">
        <v-btn class="btn_home" @click.prevent="moveToMain">홈</v-btn>
        <v-btn class="btn_delete" @click="confirmDialog = true">삭제</v-btn>
      </div>
    </v-row>

    <v-row class="flex-sm-row flex-column">
      <v-col class="col_left">
        <div class="exercise">
          <span>
            {{
              exerciseStore.exerciseList[state.elog.exerciseId - 1]
                ?.exerciseName
            }}
          </span>
        </div>
      </v-col>
      <v-col class="col_right">
        <v-row>
          <v-col>
            <div class="text-subtitle-1">운동시작</div>
            <div class="content text-subtitle-1 text-sm-h6">
              {{ formatTime(state.elog.exerciseDatetime) }}
            </div>
          </v-col>
          <v-col>
            <div class="text-subtitle-1">운동시간</div>
            <div class="content text-subtitle-1 text-sm-h6">
              {{ state.elog.exerciseDuration }} 분
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="text-subtitle-1">활동에너지</div>
            <div class="content text-subtitle-1 text-sm-h6">
              {{ state.elog.exerciseKcal }} kcal
            </div>
          </v-col>
          <v-col>
            <div class="text-subtitle-1">운동강도</div>
            <div class="content text-subtitle-1 text-sm-h6">
              {{ effortLevels[state.elog.effortLevel - 1].label }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="container mt-8" fluid>
    <v-row class="d-flex justify-center">
      <v-col cols="auto" class="d-flex justify-center flex-column">
        <span class="text-subtitle-2">주간 활동 에너지</span>
        <HealthChart
          class="mt-3 chart"
          :selectedDate="state.elog.exerciseDatetime"
          :logs="state.weeklyLogs"
          label="exerciseKcal"
        />
      </v-col>
      <v-col cols="auto" class="d-flex justify-center flex-column">
        <span class="text-subtitle-2">주간 운동 시간</span>
        <HealthChart
          class="mt-3 chart"
          :selectedDate="state.elog.exerciseDatetime"
          :logs="state.weeklyLogs"
          label="exerciseDuration"
        />
      </v-col>
    </v-row>
    <!-- md 이하일 때 화면에 보일 버튼 -->
    <v-row class="d-flex d-md-none justify-center mt-5">
      <div class="btns">
        <v-btn class="btn_home" @click.prevent="moveToMain">홈</v-btn>

        <v-btn class="btn_delete" @click="confirmDialog = true">삭제</v-btn>
      </div>
    </v-row>
  </v-container>
  <!-- 모달창 -->
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title> 삭제 </v-card-title>
      <v-card-text>운동 기록을 삭제하시겠습니까?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="dark" text @click="confirmDialog = false">취소</v-btn>
        <v-btn color="primary" text @click="confirmYes">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.container {
  padding-bottom: 70px;
}
.top {
  display: flex;
  justify-content: space-between;
  // padding: 20px 10px 50px;
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
    height: 130px;
    width: 130px;
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
  justify-content: center;
  align-content: center;

  .content {
    font-weight: 600;
  }
}
.btns {
  display: flex;
  gap: 5px;

  .v-btn {
    height: 30px;
    border-radius: 20px;
    color: #fff;
  }
  .btn_home {
    background-color: #3bbeff;
  }
  .btn_delete {
    background-color: #838383;
  }
}

.chart {
  width: 400px;
  min-width: 300px;
}

:hover {
  background-color: #fff;
}
</style>
