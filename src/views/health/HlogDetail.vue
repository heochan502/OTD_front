<script setup>
import { onMounted, reactive, ref } from "vue";
import moodLevels from "@/assets/health/moodLevels.json";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
import HealthChart from "@/components/health/HealthChart.vue";
import { useHealthStore } from "@/stores/healthStore";
import { useRoute } from "vue-router";
import { getHlog, deleteHlog } from "@/services/health/hlogService";
import router from "@/router";

const healthStore = useHealthStore();
const route = useRoute();

const state = reactive({
  hlog: {
    healthlogId: null,
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

const healthlogId = route.params.healthlogId;

onMounted(async () => {
  await healthStore.fetchHealthlogs();
  const res = await getHlog(healthlogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  state.hlog = res.data;
});

const fields = [
  { key: "moodLevel", label: "감정상태" },
  { key: "sleepQuality", label: "수면기록" },
  { key: "weight", label: "체중", unit: "kg" },
  { key: "height", label: "신장", unit: "cm" },
  { key: "systolicBp", label: "수축기 혈압", unit: "mmHg" },
  { key: "diastolicBp", label: "이완기 혈압", unit: "mmHg" },
  { key: "sugarLevel", label: "혈당", unit: "mg/dL" },
];
const selectedField = ref(fields[0].key);
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// @click
const deleteLog = async () => {
  if (!confirm("삭제하시겠습니까?")) return;
  const res = await deleteHlog(healthlogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  alert("삭제되었습니다");
  router.push("/health");
};
</script>

<template>
  <v-container>
    <v-row class="top">
      <div class="datetime">{{ formatDate(state.hlog.healthlogDatetime) }}</div>
      <div class="btns">
        <router-link to="/health">
          <v-btn class="btn_home">홈</v-btn>
        </router-link>
        <v-btn class="btn_delete" @click.prevent="deleteLog">삭제</v-btn>
      </div>
    </v-row>

    <v-item-group v-model="selectedField" selected-class="bg-blue">
      <div class="item_group">
        <div v-for="(field, idx) in fields" :key="idx" class="card-wrapper">
          <v-item v-slot="{ selectedClass, toggle }" :value="field.key">
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
              <div>
                <div class="text-h6 subtitle">
                  {{ field.label }}
                </div>
                <div class="text-center content">
                  {{
                    field.key === "moodLevel"
                      ? moodLevels.find(
                          (e) => e.level === state.hlog[field.key]
                        )?.label
                      : field.key === "sleepQuality"
                      ? sleepQualitys.find(
                          (e) => e.level === state.hlog[field.key]
                        )?.label
                      : state.hlog[field.key] +
                        (field.unit ? ` ${field.unit}` : "")
                  }}
                </div>
              </div>
            </v-card>
          </v-item>
        </div>
      </div>
    </v-item-group>
    <!-- 통계 그래프 -->
    <HealthChart
      :selectedDate="state.hlog.healthlogDatetime"
      :selectedField="selectedField"
      :fields="fields"
    />
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
    border: 2px solid #2196f3;
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

.content {
  font-weight: 700;
}

:hover {
  background-color: #fff;
}
</style>
