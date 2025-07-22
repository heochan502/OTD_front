<script setup>
import { ref } from "vue";
import effortLevels from "@/api/health/effortLevels.json";

const tab = ref("null");
</script>

<template>
  <v-card class="card" width="400" height="300">
    <v-tabs
      v-model="tab"
      bg-color="#9DDEFF"
      color="#fff"
      grow
      style="border-radius: 25px 25px 0 0"
      slider-color="#3bbeff"
    >
      <v-tab value="one">운동 리포트</v-tab>
      <v-tab value="two">건강 리포트</v-tab>
    </v-tabs>
    <v-card-text height="300">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one" class="exercise_report">
          <v-col class="content_left">
            <div>
              <div class="title">활동에너지</div>
              <div class="report_value">{{ 900 }}kcal</div>
            </div>
            <div>
              <div class="title">운동시간</div>
              <div class="report_value">{{ 120 }}분</div>
            </div>
          </v-col>
          <v-col class="content_right">
            <div class="title">운동강도</div>
            <div class="emoji">{{ effortLevels[8].emoji }}</div>
            <div class="effort_label">{{ effortLevels[8].label }}</div>
            <div>어제보다 활동량이 더 많아요!</div>
          </v-col>
        </v-tabs-window-item>
        <v-tabs-window-item value="two"> 건강리포트 내용 </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.v-tab {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}
.v-tab.v-tab--selected {
  background-color: #3bbeff;
}
.exercise_report {
  display: flex;
  padding: 20px 20px 0;

  align-items: center;
  .content_left {
    div {
      padding: 0 3px;
    }
    .report_value {
      font-size: 20px;
      font-weight: 700;
      padding-bottom: 10px;
    }
  }

  .content_right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .emoji {
      font-size: 40px;
    }
    .effort_label {
      font-size: 12px;
      background-color: #3bbeff;
      color: #fff;
      border-radius: 20px;
      padding: 2px 10px;
      margin: 7px 0 5px;
      width: fit-content;
    }
  }
}
.title {
  font-size: 16px;
}
</style>
