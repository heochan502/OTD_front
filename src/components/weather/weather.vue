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
  if (hour < 12) return (timeName = 'morning');
  else if (hour < 18) return (timeName = 'evening');
  else return (timeName = 'night');
});

const backgroundImg = {
  '맑음-morning': 'url(src/image/weather/clear_morning.jpg)',
  '맑음-evening': 'url(src/image/weather/clear_afternoon.jpg)',
  '맑음-night': 'url(src/image/weather/clear_night.jpg)',
  '흐림-morning': 'url(src/image/weather/cloudy.jpg)',
  '흐림-evening': 'url(src/image/weather/cloudy.jpg)',
  '흐림-night': 'url(src/image/weather/cloudy_night.jpg)',
  '구름 많음-morning': 'url(src/image/weather/littlecloudy_morning.jpg)',
  '구름 많음-evening': 'url(src/image/weather/littlecloudy.jpg)',
  '구름 많음-night': 'url(src/image/weather/littlecloudy_night.jpg)',
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
  <div class="weather-basetime" v-if="weather">
    <div class="basetime">날씨예보 기준 시간</div>
    <div class="basetime">{{ weather.baseTime }}</div>
  </div>
  <div
    class="weather-card"
    v-if="weather"
    :style="{ backgroundImage: weatherBackground }"
  >
    <div class="weather-location">{{ weather.localName }}</div>
    <div class="weather-header">
      <div class="weather-icon">{{ skyEmoji }}</div>
      <div class="weather-info">
        <div class="temperature">{{ weather.tem }} ℃</div>
        <div class="condition">{{ weather.sky }}</div>
        <div class="humidity">습도 : {{ weather.reh }}%</div>
      </div>
      <p class="weather-info">
        최저/최고 : {{ weather.tmn + '°/' + weather.tmx }}°
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather-live {
  display: flex;
  flex-direction: row;
  max-width: fit-content;

  .weather-livetime {
    border-radius: 16px 16px 0 0;
    background: skyblue;
  }
}

.weather-card {
  background-size: cover;
  background-position: center;
  border-radius: 0px 16px 16px 16px;
  padding: 1.5rem;
  // max-width: 400px;
  // box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  .weather-location {
    font-size: 2rem;
    color: white;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  .weather-header {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    .weather-icon {
      font-size: 3rem;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
      color: #fff;
    }

    .weather-info {
      display: flex;
      flex-direction: column;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);

      .temperature {
        font-size: 2rem;
        font-weight: 600;
        color: white;
      }

      .condition {
        font-size: 1rem;
        color: #fff;
      }
    }
  }

  .weather-basetime {
    margin-top: 1rem;
    // max-width: 100px;
    font-size: 0.5rem;
    color: #222;

    .label {
      font-weight: 500;
      color: #000;
    }

    .basetime {
      font-size: 0.7rem;
      color: #222;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
