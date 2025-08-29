<script setup>
import { onMounted, reactive, ref } from "vue";
import moodLevels from "@/assets/health/moodLevels.json";
import sleepQualitys from "@/assets/health/sleepQualitys.json";
import HealthChart from "@/components/health/HealthChart.vue";
import { useHealthStore } from "@/stores/healthStore";
import { useRoute } from "vue-router";
import { getHlog, deleteHlog } from "@/services/health/hlogService";
import router from "@/router";
import { formatDate } from "@/utils/reportUtils";

const healthStore = useHealthStore();
const route = useRoute();
const confirmDialog = ref(false);

const state = reactive({
  hlog: [],
});

const healthlogId = route.params.healthlogId;

onMounted(async () => {
  if (!healthlogId) {
    return;
  }

  const res = await getHlog(healthlogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  state.hlog = res.data;
  console.log("정보 : ", route);
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

// @click
const moveToMain = () => {
  router.push({
    path: "/health",
  });
};
const confirmYes = async () => {
  const res = await deleteHlog(healthlogId);
  if (res === undefined || res.status !== 200) {
    alert("에러발생");
    return;
  }
  router.push("/health");
};
</script>

<template>
  <v-container class="pb-16">
    <v-row class="top">
      <div class="text-h6 text-md-h5">
        {{ formatDate(state.hlog.healthlogDatetime) }}
      </div>
      <div class="btns d-none d-md-flex">
        <v-btn class="btn_home" @click.prevent="moveToMain">홈</v-btn>
        <v-btn class="btn_delete" @click="confirmDialog = true">삭제</v-btn>
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
                ,
              ]"
              min-height="100"
              min-width="150"
              dark
              @click="toggle"
            >
              <div>
                <div class="text-subtitle-2 subtitle">
                  {{ field.label }}
                </div>
                <div class="text-subtitle-1 text-center content">
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
    <div class="pt-10">
      <HealthChart
        :selected-date="state.hlog.healthlogDatetime"
        :selectedField="selectedField"
        :fields="fields"
        :logs="healthStore.logList"
      />
    </div>
    <!-- md 이하일 때 화면에 보일 버튼 -->
    <v-row class="d-flex d-md-none justify-center mt-5">
      <div class="btns">
        <v-btn class="btn_home" @click.prevent="moveToMain">홈</v-btn>
        <v-btn class="btn_delete" @click.prevent="confirmDialog = true"
          >삭제</v-btn
        >
      </div>
    </v-row>
  </v-container>
  <!-- 모달창 -->
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title> 삭제 </v-card-title>
      <v-card-text>건강 기록을 삭제하시겠습니까?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="dark" text @click="confirmDialog = false">취소</v-btn>
        <v-btn color="primary" text @click="confirmYes">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px 50px;
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
