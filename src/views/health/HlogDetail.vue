<script setup>
import { onMounted, reactive } from "vue";
import moodLevels from "@/assets/health/moodLevels.json";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
import HealthCart from "@/components/health/HealthChart.vue";

const healthlog = reactive({
  healthlog_id: 1,
  weight: 60,
  height: 170,
  systolic_bp: 80,
  diastolic_bp: 115,
  sugar_level: 100,
  mood_level: 5,
  sleep_quality: 4,
  healthlog_datetime: "2025-07-28",
});

const fields = [
  { key: "mood_level", label: "감정상태" },
  { key: "sleep_quality", label: "수면기록" },
  { key: "weight", label: "체중", unit: "kg" },
  { key: "height", label: "신장", unit: "cm" },
  { key: "systolic_bp", label: "수축기 혈압", unit: "mmHg" },
  { key: "diastolic_bp", label: "이완기 혈압", unit: "mmHg" },
  { key: "sugar_level", label: "혈당", unit: "mg/dL" },
];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

onMounted(() => {});
</script>

<template>
  <v-container>
    <v-row class="top">
      <div class="datetime">{{ formatDate(healthlog.healthlog_datetime) }}</div>
      <div class="btns">
        <v-btn class="btn_home">홈</v-btn>
        <v-btn class="btn_delete">삭제</v-btn>
      </div>
    </v-row>

    <v-item-group selected-class="bg-primary">
      <div class="item_group">
        <div v-for="(field, idx) in fields" :key="idx" class="card-wrapper">
          <v-item v-slot="{ selectedClass, toggle }">
            <v-card
              :class="[
                'd-flex flex-column justify-center align-center text-center',
                selectedClass,
              ]"
              height="150"
              width="200"
              dark
              @click="toggle"
            >
              <div class="text-h6 subtitle">
                {{ field.label }}
              </div>
              <div class="text-center content">
                {{
                  field.key === "mood_level"
                    ? moodLevels[healthlog[field.key]]?.label
                    : field.key === "sleep_quality"
                    ? sleepQualitys[healthlog[field.key]]?.label
                    : healthlog[field.key] +
                      (field.unit ? ` ${field.unit}` : "")
                }}
              </div>
            </v-card>
          </v-item>
        </div>
      </div>
    </v-item-group>
    <HealthCart />
  </v-container>
</template>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px 50px;

  .datetime {
    font-size: 25px;
    font-weight: 600;
  }
}
.item_group {
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  gap: 10px;

  .v-card {
    border-radius: 20px;
  }
  .subtitle {
    padding-bottom: 10px;
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
</style>
