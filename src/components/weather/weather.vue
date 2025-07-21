<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { getWeather } from '@/services/weather/weatherHomeService';
import { login } from '@/services/accountService';
const staste = reactive({});

const memberId = ref('');
const weather = ref(null);

const LocalWeather = async () => {
  const res = await getWeather(memberId.value);
  console.log(res.data);
  weather.value = res.data;
};

onMounted(async () => {
  LocalWeather();
});

// 디자인
const skyEmojiList = {
  맑음: '☀️',
  흐림: '☁️',
  구름많음: '🌤️',
  비: '🌧️',
  눈: '❄️',
  비눈: '🌨️',
  default: '🌈',
};

const skyEmoji = computed(() => {
  return skyEmojiList[weather.value?.condition] || skyEmojiList.default;
});

const dayTimes = computed(() => {
  const hour = new Date().getHours();
  console.log('hour', hour);
  let timeName = '';
  if (hour < 18) {
    return (timeName = 'AM');
  } else {
    return (timeName = 'PM');
  }
});

const backgroundImg = {
  '맑음-AM': 'url(src/image/weather/clear_morning.jpg)',
  '맑음-PM': 'url(src/image/weather/clear_afternoon.jpg)',
  '흐림-AM': 'url(src/image/weather/cloudy.jpg)',
  '흐림-PM': 'url(src/image/weather/cloudy.jpg)',
  '구름많음-AM': 'url(src/image/weather/little_cloudy_morning.jpg)',
  '구름많음-PM': 'url(src/image/weather/little_cloudy.jpg)',
  '비-AM': 'url(src/image/weather/rain.jpg)',
  '비-PM': 'url(src/image/weather/rain.jpg)',
  default: 'url(src/image/weahter/default.png)',
};

const weatherBackground = computed(() => {
  const condition = weather.value?.condition || '';
  const time = dayTimes.value ? 'AM' : 'PM';
  return backgroundImg[`${condition}-${time}`] || backgroundImg.default;
});
</script>

<template>
  <div class="weather-live">
    <input
      class="weather-livetime"
      v-model="memberId"
      placeholder="회원번호 입력"
    />
    <button class="weather-livetime" @click="LocalWeather">날씨 조회</button>
  </div>
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
        <div class="temperature">{{ weather.temperature }} ℃</div>
        <div class="condition">{{ weather.condition }}</div>
      </div>
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
