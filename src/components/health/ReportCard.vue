<script setup>
import ExerciseReport from "./ExerciseReport.vue";
import HealthReport from "./HealthReport.vue";
import { ref, onMounted, onUnmounted } from "vue";

const tabs = ["one", "two"];
const tab = ref("one");

let intervalId;
const isPaused = ref(false);

function startCycle() {
  stopCycle();
  intervalId = setInterval(() => {
    if (!isPaused.value) {
      const currentIndex = tabs.indexOf(tab.value);
      tab.value = tabs[(currentIndex + 1) % tabs.length];
    }
  }, 3000);
}
function stopCycle() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
onMounted(startCycle);
onUnmounted(stopCycle);
</script>

<template>
  <v-card
    class="card"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
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
