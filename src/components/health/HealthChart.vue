<script setup>
import { computed, ref } from "vue";

const exhale = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const checking = ref(false);
const heartbeats = ref([]);
const avg = computed(() => {
  const sum = heartbeats.value.reduce((acc, cur) => acc + cur, 0);
  const length = heartbeats.value.length;
  if (!sum && !length) return 0;
  return Math.ceil(sum / length);
});
function heartbeat() {
  return Math.ceil(Math.random() * (120 - 80) + 80);
}
async function takePulse(inhale = true) {
  checking.value = true;
  inhale && (await exhale(1000));
  heartbeats.value = Array.from({ length: 20 }, heartbeat);
  checking.value = false;
}
takePulse(false);
</script>

<template>
  <v-card class="mx-auto ma-10">
    <template v-slot:prepend>
      <v-icon
        class="me-8"
        icon="mdi-weight-kilogram"
        size="64"
        @click="takePulse"
      ></v-icon>
    </template>

    <template v-slot:title>
      <div class="text-caption text-grey text-uppercase">평균 체중</div>

      <span class="text-h3 font-weight-black" v-text="avg || '—'"></span>
      <strong v-if="avg">Kg</strong>
    </template>

    <v-sheet color="transparent">
      <v-sparkline
        :key="String(avg)"
        :gradient="['#D4FFEC', '#3BBEFF', '#4596FB']"
        :line-width="3"
        :model-value="heartbeats"
        :smooth="16"
        stroke-linecap="round"
        auto-draw
      ></v-sparkline>
    </v-sheet>
  </v-card>
</template>

<style lang="scss" scoped></style>
