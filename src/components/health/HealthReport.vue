<script setup>
import { computed, onMounted, reactive } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import { getDateString, filterHealthLogsByDate } from "@/utils/reportUtils";
import moodLevels from "@/assets/health/moodLevels.json";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
const healthStore = useHealthStore();

onMounted(async () => {
  await healthStore.fetchHealthlogs();
});

const todayStr = getDateString();
const todayLog = computed(() =>
  filterHealthLogsByDate(healthStore.logs, todayStr)
);

const state = computed(() => {
  const log = todayLog.value[0] || {};
  return [
    moodLevels[log.moodLevel].label || 0,
    sleepQualitys[log.sleepQuality].label || 0,
    log.diastolicBp || 0,
    log.sugarLevel || 0,
  ];
});

const colors = ["#fcc5e4", "#ff7882", "#fda34b", "#020f75"];
const subtitle = ["오늘의 기분", "오늘의 수면", "오늘의 혈압", "오늘의 당수치"];

const minBmi = 15;
const maxBmi = 40;

const bmi = computed(() => {
  if (!healthStore.logs.length) return 0;
  const heightInMeters = (healthStore.logs[0]?.height || 0) / 100;

  if (!heightInMeters || !healthStore.logs[0]?.weight) return 0;
  return parseFloat(
    (healthStore.logs[0]?.weight / heightInMeters ** 2).toFixed(1)
  );
});

const bmiStatus = computed(() => {
  const userBmi = bmi.value;
  if (userBmi === 0) return "기록없음";
  else if (userBmi < 18.5) return "저체중";
  else if (userBmi < 25) return "정상체중";
  else if (userBmi < 30) return "과체중";
  else if (userBmi < 35) return "비만";
  else return "고도비만";
});
</script>

<template>
  <v-tabs-window-item value="two" class="health_report">
    <v-col class="content_left" cols="6">
      <div class="large-box">
        <v-carousel
          height="200"
          width="170"
          show-arrows="hover"
          cycle
          hide-delimiter-background
          hide-delimiters
          interval="3000"
          class="report-carousel"
        >
          <v-carousel-item class="sheet" v-for="(item, i) in subtitle" :key="i">
            <v-sheet :color="colors[i]" height="100%">
              <div class="d-flex justify-center align-center flex-column pa-3">
                <div class="text-h6 pa-3">{{ item }}</div>
                <div
                  v-if="!todayLog || todayLog.length === 0"
                  class="fill-height"
                >
                  기록없음
                </div>
                <div v-else class="text-h3 pa-3 fill-height">
                  {{ state[i] }}
                </div>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-col>
    <v-col class="content_right" cols="6">
      <div class="small_box">
        <span>weight</span>
        <span class="value">
          {{ healthStore.logs.length === 0 ? 0 : healthStore.logs[0]?.weight }}
          kg
        </span>
      </div>
      <div class="small_box">
        <span>height</span>
        <span class="value">
          {{ healthStore.logs.length === 0 ? 0 : healthStore.logs[0]?.height }}
          cm
        </span>
      </div>
      <div class="medium-box">
        <span class="subtitle"> BMI </span>
        <div class="d-flex justify-space-between">
          <span class="value">
            {{ bmi }}
          </span>
          <v-btn
            variant="flat"
            size="x-small"
            color="#3BBEFF"
            class="text-white"
            >{{ bmiStatus }}</v-btn
          >
        </div>
        <div>
          <!-- 슬라이더로 현재 유저 bmi 보여주기 -->
          <div class="bmi-slider-wrapper">
            <div class="gradient-bar"></div>
            <v-slider
              :model-value="bmi"
              :min="minBmi"
              :max="maxBmi"
              step="0.1"
              track-size="12"
              thumb-size="6"
              thumb-color="white"
              color="transparent"
              class="bmi-slider"
              readonly
              thumb-label
              hide-details
            />
          </div>
          <!-- 범례 -->
          <div class="bmi-legend">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>40</span>
          </div>
        </div>
      </div>
    </v-col>
  </v-tabs-window-item>
</template>

<style lang="scss" scoped>
.health_report {
  display: flex;

  .content_left {
    display: flex;
    flex-direction: column;

    .large-box {
      background-color: #bfeaff;
      width: 170px;
      height: 200px;
      border-radius: 10px;
    }
    .report-carousel {
      border-radius: 10px;
    }
  }

  .content_right {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .small_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 5px 15px;
      width: 180px;
      height: 40px;
      background-color: #ececec;
      border-radius: 10px;
    }
    .medium-box {
      display: flex;
      flex-direction: column;
      width: 180px;
      height: 105px;
      padding: 5px 15px;
      background-color: #bfeaff;
      border-radius: 10px;

      .bmi-slider-wrapper {
        position: relative;
        margin-top: 10px;
      }
      .gradient-bar {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 8px;
        width: 100%;
        border-radius: 6px;
        background: linear-gradient(
          to right,
          #3f51b1 0%,
          #5a55ae 13%,
          #7b5fac 25%,
          #8f6aae 38%,
          #a86aa4 50%,
          #cc6b8e 62%,
          #f18271 75%,
          #f3a469 87%,
          #f7c978 100%
        );
        z-index: 0;
      }
    }
    .bmi-legend {
      display: flex;
      justify-content: space-between;
      //   color: #ececec;
      font-size: 9px;
    }
  }

  .value {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
