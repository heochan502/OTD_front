<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { getWeather } from '@/services/weather/weatherHomeService';

const staste = reactive({});

const memberId = ref('');
const weather = ref(null);

const LocalWeather = async () => {
  const res = await getWeather();
  console.log(res.data);
  weather.value = res.data;
};

onMounted(async () => {
  LocalWeather();
});

// 이모트 및 사진
const skyEmojiList = {
  맑음: '☀️',
  흐림: '☁️',
  '구름 많음': '🌤️',
  비: '🌧️',
  눈: '❄️',
  비눈: '🌨️',
  default: '🌈',
};

const skyEmoji = computed(() => {
  return skyEmojiList[weather.value?.sky] || skyEmojiList.default;
});

const dayTimes = computed(() => {
  const hour = new Date().getHours();
  let timeName = '';
  if (hour > 6 && hour < 19) return (timeName = 'morning');
  else if (hour < 22) return (timeName = 'evening');
  else return (timeName = 'night');
});

const backgroundImg = {
  '맑음-morning': 'url(src/image/weather/clear_morning.jpg)',
  '맑음-evening': 'url(src/image/weather/clear_afternoon.jpg)',
  '맑음-night': 'url(src/image/weather/clear_night.jpg)',
  '구름 많음-morning': 'url(src/image/weather/littlecloudy_morning.jpg)',
  '구름 많음-evening': 'url(src/image/weather/littlecloudy.jpg)',
  '구름 많음-night': 'url(src/image/weather/littlecloudy_night.jpg)',
  '흐림-morning': 'url(src/image/weather/cloudy.jpg)',
  '흐림-evening': 'url(src/image/weather/cloudy.jpg)',
  '흐림-night': 'url(src/image/weather/cloudy_night.jpg)',
  '비-morning': 'url(src/image/weather/rain.jpg)',
  '비-evening': 'url(src/image/weather/rain.jpg)',
  '비-night': 'url(src/image/weather/rain.jpg)',
  default: 'url(src/image/weather/default.png)',
};

const weatherBackground = computed(() => {
  const sky = weather.value?.sky || '';
  const time = dayTimes.value;
  console.log('time', time);
  return backgroundImg[`${sky}-${time}`] || backgroundImg.default;
});
</script>

<template>
  <router-link :to="'/location'" class="button">지역 변경</router-link>
  <div
    class="weather-card"
    v-if="weather"
    :style="{ backgroundImage: weatherBackground }"
  >
    <div class="weather-content">
      <!-- 왼쪽 영역 -->
      <div class="weather-left">
        <div class="weather-location">{{ weather.localName }}</div>
        <div class="condition">{{ weather.sky }}</div>
      </div>

      <!-- 오른쪽 영역 -->
      <div class="weather-right">
        <div class="warp">
          <div class="weather-icon">{{ skyEmoji }}</div>
          <div class="temperature">{{ weather.tem }} ℃</div>
        </div>
        <div class="max_min_temperature">
          최저 : {{ weather.tmn + '° / 최고 : ' + weather.tmx }}°
        </div>
        <div class="humidity">습도: {{ weather.reh }}%</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button {
  margin: 1rem 1rem 0px 1rem;
  padding: 0 1rem 0.1rem;
  background-color: #3bbeff;
  border-radius: 16px 16px 0 0;
}

.weather-card {
  background-size: cover;
  background-position: center;
  border-radius: 0px 16px 16px 16px;
  padding: 1rem;
  margin: 0px 1rem;
  color: white;
  max-width: 100%;
  box-sizing: border-box;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);

  .weather-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .weather-left {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .weather-location {
      font-size: 2.4rem;
      font-weight: bold;
    }

    .condition {
      font-size: 1rem;
    }
  }

  .warp {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .weather-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;

    .weather-icon {
      font-size: 3rem;
    }

    .temperature {
      font-size: 2rem;
      font-weight: bold;
    }

    .max_min_temperature,
    .humidity {
      font-size: 1rem;
    }
  }
}
</style>
