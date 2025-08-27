<script setup>
import { computed, onMounted, reactive } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import { getDateString, filterHealthLogsByDate } from "@/utils/reportUtils";
import moodLevels from "@/assets/health/moodLevels.json";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
const healthStore = useHealthStore();

// onMounted(async () => {
//   await healthStore.fetchHealthlogs();
// });

const todayStr = getDateString();
const todayLog = computed(() =>
  filterHealthLogsByDate(healthStore.logList, todayStr)
);

const state = computed(() => {
  const log = todayLog.value[0] || {};
  return [
    moodLevels[log.moodLevel].label || 0,
    sleepQualitys[log.sleepQuality].label || 0,
    log.systolicBp || 0,
    log.diastolicBp || 0,
    log.sugarLevel || 0,
  ];
});

// 캐러셀에 사용할 옵션
const colors = ["#fcc5e4", "#ff7882", "#fda34b", "#0F73D2", "#44cab4"];
const fields = [
  { key: "moodLevel", label: "오늘의 기분" },
  { key: "sleepQuality", label: "오늘의 수면" },
  { key: "systolicBp", label: "오늘의 수축기 혈압", unit: "mmHg" },
  { key: "diastolicBp", label: "오늘의 이완기 혈압", unit: "mmHg" },
  { key: "sugarLevel", label: "오늘의 혈당", unit: "mg/dL" },
];

// bmi 관련
const minBmi = 15;
const maxBmi = 40;

const bmi = computed(() => {
  if (!healthStore.logList.length) return 0;
  const heightInMeters = (healthStore.logList[0]?.height || 0) / 100;
  if (!heightInMeters || !healthStore.logList[0]?.weight) return 0;
  return parseFloat(
    (healthStore.logList[0]?.weight / heightInMeters ** 2).toFixed(1)
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
      <div class="large-box w-100">
        <v-carousel
          height="200"
          width="170"
          show-arrows="hover"
          cycle
          hide-delimiter-background
          hide-delimiters
          interval="3500"
          class="report-carousel"
        >
          <v-carousel-item
            class="sheet"
            v-for="(item, idx) in fields"
            :key="idx"
          >
            <v-sheet :color="colors[idx]" height="100%">
              <div
                class="d-flex justify-center align-center flex-column pa-3 text-center"
              >
                <div class="text-subtitle-2 text-sm-h6 pa-3">
                  {{ item.label }}
                </div>
                <div
                  v-if="!todayLog || todayLog.length === 0"
                  class="fill-height text-caption text-sm-body-1"
                >
                  기록없음
                </div>
                <div
                  v-else
                  class="pa-3 fill-height text-caption text-sm-body-1"
                >
                  {{ state[idx] }} {{ item.unit }}
                </div>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-col>
    <v-col class="content_right" cols="6">
      <!-- weight -->
      <div class="small_box w-100">
        <span class="text-caption text-sm-body-2">weight</span>
        <span class="value text-caption text-sm-text-body-2">
          {{
            healthStore.logList.length === 0
              ? 0
              : healthStore.logList[0]?.weight
          }}
          kg
        </span>
      </div>
      <!-- height -->
      <div class="small_box w-100">
        <span class="text-caption text-sm-body-2">height</span>
        <span class="value text-caption text-sm-text-body-2">
          {{
            healthStore.logList.length === 0
              ? 0
              : healthStore.logList[0]?.height
          }}
          cm
        </span>
      </div>
      <div class="medium-box w-100">
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
            <div class="gradient-bar w-100"></div>
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
        // width: 100%;
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
}
</style>
