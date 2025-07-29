<script setup>
import { ref } from "vue";
import ExerciseReport from "./ExerciseReport.vue";
import HealthReport from "./HealthReport.vue";

const tab = ref("two");
</script>

<template>
  <v-card class="card">
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
        <ExerciseReport />
        <HealthReport />
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.card {
  width: 400px;
  height: 300px;
  border-radius: 25px 25px 0 0;
}
.v-tab {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}
.v-tab.v-tab--selected {
  background-color: #3bbeff;
}

.v-card-text {
  padding: 10px 5px;
}
</style>
