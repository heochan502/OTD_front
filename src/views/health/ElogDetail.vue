<script setup>
import { onMounted, reactive } from "vue";
import effortLevels from "@/assets/health/effortLevels.json";
import { deleteElog, getElog } from "@/services/health/elogService";
import { useExerciseStore } from "@/stores/exerciseStore";
import { useRoute, useRouter } from "vue-router";
import HealthChart from "@/components/health/HealthChart.vue";
import { formatDate } from "@/utils/reportUtils";

const exerciseStore = useExerciseStore();
const route = useRoute();
const router = useRouter();

const state = reactive({
  elog: {
    exerciselogId: 0,
    exerciseId: null,
    exerciseDatetime: "",
    exerciseKcal: 0,
    exerciseDuration: 0,
    effortLevel: 1,
  },
});

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  // const hour = String(date.getHours().padStart(2, "0"));
  // const minutes = String(date.getMinutes().padStart(2, "0"));

  return `${date.getHours()}시 ${date.getHours()}분`;
};

const exerciseLogId = route.params.exerciselogId;

onMounted(async () => {
<<<<<<<<< Temporary merge branch 1
  const exerciseLogId = route.params.exerciselogId;
  if (!exerciseLogId) return;
  const res = await getElog(exerciseLogId);
=========
  // exerciseStore.fetchExercises();
  state.elog.exerciselogId = route.params.exerciselogId;
  const res = await getElog(state.elog.exerciselogId);
>>>>>>>>> Temporary merge branch 2
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  console.log("운동기록", res.data);
  state.elog = res.data;
  console.log("저장", state.elog.effortLevel);
});

// @click
// const moveToMain = () => {
//   router.push({
//     path: "/health",
//   });
// };

const deleteLog = async () => {
  if (!confirm("삭제하시겠습니까?")) return;
  const exerciselogId = state.elog.exerciselogId;
  const res = await deleteElog(exerciselogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  alert("삭제되었습니다.");
  router.push("/health");
};
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="top">
      <div class="exercise_datetime">
        {{ formatDate(state.elog.exerciseDatetime) }}
      </div>
      <div class="btns">
        <router-link to="/health">
          <v-btn class="btn_home">홈</v-btn>
        </router-link>
        <v-btn class="btn_delete" @click.prevent="deleteLog">삭제</v-btn>
      </div>
    </v-row>

    <v-row class="contents align-center">
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
              {{ effortLevels[state.elog.effortLevel - 1].label }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="container mt-8">
    <v-row>
      <v-col cols="12" md="6">
        <span class="text-subtitle-2">주간 활동 에너지</span>
        <HealthChart
          class="mt-3"
          :selectedDate="state.elog.exerciseDatetime"
          :logs="exerciseStore.logList"
          label="exerciseKcal"
        />
      </v-col>
      <v-col cols="12" md="6">
        <span class="text-subtitle-2">주간 운동 시간</span>
        <HealthChart
          class="mt-3"
          :selectedDate="state.elog.exerciseDatetime"
          :logs="exerciseStore.logList"
          label="exerciseDuration"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.container {
  padding: 0 50px;
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
  display: flex;
  gap: 10px;
}

:hover {
  background-color: #fff;
}
</style>
