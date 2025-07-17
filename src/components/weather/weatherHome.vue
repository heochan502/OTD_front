<script setup>
import { reactive, onMounted } from 'vue';
import { getUltraSrtFcst } from '@/services/weather/weatherHomeService';

const state = reactive({
  items: [],
});

onMounted(async () => {
  try {
    const baseDate = '20250717';
    const baseTime = '1400';
    const nx = 60;
    const ny = 127;

    const response = await getUltraSrtFcst(baseDate, baseTime, nx, ny);

    // 응답 성공 시
    weatherData.value = response.data;
  } catch (e) {
    error.value = e;
    console.error('API 호출 실패:', e);
  }
});

// onMounted(async () => {
//   const res = await getUltraSrtFcst();
//   state.items = res.data;
//   console.log('state.items : ', state.items);
// });
</script>

<template>
  <div class="summary">
    <span>날씨 자세히 보기</span>
    <p>날씨 한줄 요약</p>
  </div>
  <div class="weather">
    <li v-for="(item, i) in items" :key="i">
      {{ item.category }} ({{ categoryMap[item.category] }}):
      {{ item.obsrValue }}
    </li>
    날씨 화면
  </div>
</template>

<style lang="scss" scoped>
.summary {
  font-size: 30px;
  justify-content: space-around;
  display: flex;
  color: black;
}
.weather {
  color: black;
  border: 1px solid black;
}
</style>
