<script setup>
import { ref, onMounted, computed } from 'vue';
import { getWeather, getNickName } from '@/services/weather/weatherHomeService';

const weather = ref(null);
const open = ref(false);
const nickName = ref('');

const LocalWeather = async () => {
  const res = await getWeather();
  console.log(res.data);
  weather.value = res.data;
};
// 한줄 알림
const memberNickName = async () => {
  const res = await getNickName();
  console.log(res.data.memberNick);
  nickName.value = res.data.memberNick;
};
const popMessage = computed(() => {
  const pop = weather.value.pop;
  const per = '오늘은 비올 확률이' + weather.value.pop + ' % !!';
  const sky = weather.value.sky;
  if ((pop < 10 && sky === '맑음') || (pop < 10 && sky === '구름 많음')) {
    return '오늘의 날씨는 ' + sky + '이네요! 즐거운 하루 보내세요.';
  } else if (
    (pop < 30 && sky === '맑음') ||
    (pop < 30 && sky === '구름 많음')
  ) {
    return per + '걱정 되신다면 우산을 챙기길 추천해요!';
  } else if (pop < 50 || sky === '흐림') {
    return per + '비가 올 수도 있으니 휴대하기 편한 우산 챙기길 추천해요!';
  } else if (pop < 90) {
    return per + '우산 챙기셨나요? 우산 챙겨가세요!';
  } else if (pop > 90 || sky === '비') {
    return per + '우산을 꼭 챙기고 빗길 조심하세요!';
  } else {
    return per + '오늘 하루도 화이팅!';
  }
});

const toggleMenu = () => (open.value = !open.value);

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

onMounted(async () => {
  memberNickName();
  LocalWeather();
});
</script>

<template>
  <div class="weather-alert" v-if="weather">
    <strong>{{ nickName }}님~</strong>{{ popMessage }}
  </div>
  <div class="flex justify-between items-center w-full px-4 pt-2">
    <button class="live px-4 py-1 text-white font-semibold text-sm">
      실시간 날씨 정보
    </button>
    <button @click="toggleMenu" class="menu px-2 py-1 text-sm font-bold">
      ☰ 날씨 메뉴
    </button>
    <router-link v-if="open" to="/location" class="menu-list">
      지역 변경
    </router-link>
  </div>
  <div>
    <div class="weather-card" :style="{ backgroundImage: weatherBackground }">
      <div v-if="weather" class="weather-content">
        <!-- left -->
        <div class="weather-left">
          <div class="weather-location">
            {{ weather.localName }}
          </div>
          <div class="condition">{{ weather.sky }}</div>
        </div>
        <!-- right -->
        <div class="weather-right">
          <div class="warp">
            <div class="weather-icon">{{ skyEmoji }}</div>
            <div class="temperature">{{ weather.tem }}℃</div>
          </div>
          <div class="max_min_temperature">
            {{ '최저 ' + weather.tmn + '° / 최고 ' + weather.tmx }}°
          </div>
          <div class="humidity">습도 {{ weather.reh }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather-alert {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 1rem;
  margin: 1rem auto;
  max-width: 90%;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  color: #333;
  line-height: 1.4;

  strong {
    font-weight: bold;
    margin-right: 0.3rem;
  }
}
.live {
  background-color: #3bbeff;
  border-radius: 16px 16px 0 0;
}

.menu {
  color: #3bbeff;
  background-color: transparent;
  border: none;
}
.menu-list {
  color: #ccc;
  padding: 0 1rem 0.1rem;
  border-radius: 16px;
  &:hover {
    background-color: white;
  }
}

.weather-card {
  background-size: cover;
  background-position: center;
  border-radius: 0 16px 16px 16px;
  padding: 1rem;
  margin: 0px 1rem;
  color: white;
  max-width: 100%;
  height: 11rem;
  box-shadow: 1px 1px 4px #838383;
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
      font-size: 1.2rem;
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
