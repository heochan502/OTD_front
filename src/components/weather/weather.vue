<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { getWeather } from '@/services/weather/weatherHomeService';

const memberId = ref('');
const weather = ref(null);

const LocalWeather = async () => {
  const res = await getWeather(memberId.value);
  console.log(res.data);
  weather.value = res.data;
};

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
</script>

<template>
  <div class="weather-live">
    <input
      class="weather-livetime"
      v-model="memberId"
      placeholder="회원번호 입력"
    />
    <button class="weather-livetime" @click="LocalWeather">날씨 조회</button>
    <div class="weather-basetime">
      <div class="label">날씨예보 기준 시간</div>
      <div class="value">{{ weather.baseTime }}</div>
    </div>
  </div>
  <div class="weather-card" v-if="weather">
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
    background: #fff;
  }
}

.weather-card {
  background: #f2fbff;
  border-radius: 0px 16px 16px 16px;
  padding: 1.5rem;
  // max-width: 400px;
  // box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  .weather-location {
    color: #222;
  }

  .weather-header {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    .weather-icon {
      font-size: 3rem;
    }

    .weather-info {
      display: flex;
      flex-direction: column;

      .temperature {
        font-size: 2rem;
        font-weight: 600;
        color: #333;
      }

      .condition {
        font-size: 1rem;
        color: #666;
      }
    }
  }

  .weather-basetime {
    margin-top: 1rem;
    max-width: 100px;

    .label {
      font-weight: 500;
      font-size: 0.9rem;
      color: #444;
    }

    .value {
      font-size: 1rem;
      color: #222;
    }
  }
}
</style>
