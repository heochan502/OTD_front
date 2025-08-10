<script setup>
import { computed, onMounted, ref } from "vue";
import { useHealthStore } from "@/stores/healthStore";
import { round } from "lodash";

const healthStore = useHealthStore();

onMounted(async () => {
  await healthStore.fetchHealthlogs();
});

const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];

const value = ref([0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]);
</script>

<template>
  <v-sparkline
    :auto-line-width="true"
    :radius="10"
    :gradient="gradients"
    :gradient-direction="top"
    :line-width="2"
    :model-value="value"
    :lineCap="round"
    :padding="8"
    :smooth="true"
    :stroke-linecap="lineCap"
    :type="trend"
    auto-draw
  ></v-sparkline>
</template>

<style lang="scss" scoped></style>
