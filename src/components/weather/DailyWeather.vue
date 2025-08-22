<script setup>
import { ref, computed, onMounted } from 'vue';
import { getDailyWeather } from '@/services/weather/weatherHomeService';

const dayWeather = ref([]);

const DayWeather = async () => {
  const res = await getDailyWeather();
  console.log('daily :', res.data);
  dayWeather.value = res.data;
};

const convertTime = (fcstTime) => {
  // 앞 두자리만 잘라서 숫자로 변환
  const hour = parseInt(fcstTime.substring(0, 2), 10);
  return `${hour}시`;
};
const dayWeatherWithTime = computed(() =>
  dayWeather.value.map((item) => ({
    ...item,
    time: convertTime(item.fcstTime),
    emoji: skyEmojiList[item.sky] || '',
  }))
);
const skyEmojiList = {
  맑음: '☀️',
  흐림: '☁️',
  '구름 많음': '🌤️',
  비: '🌧️',
  눈: '❄️',
  '비/눈': '🌨️',
};

onMounted(async () => {
  await DayWeather();
});
</script>

<template>
  <div class="info">
    <div class="item" v-for="item in dayWeatherWithTime" :key="item.fcstTime">
      {{ item.time }} {{ item.emoji }} {{ item.tmp }}℃
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  justify-content: center;
}
.item {
  align-items: center;
  justify-content: center;
}
</style>
