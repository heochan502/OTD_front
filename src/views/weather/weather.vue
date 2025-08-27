<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getWeather, getNickName } from '@/services/weather/weatherHomeService';
import DailyWeather from '@/components/weather/DailyWeather.vue';
import Location from '@/components/weather/Location.vue';
import { useWeatherStore } from '@/stores/weatherStore';
import { now } from 'lodash';

const weatherStore = useWeatherStore();
const weather = ref(null);
const open = ref(false);
const nickName = ref('');
const dialog = ref({
  daily: false,
  location: false,
});
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDay();
const nowDate = `${year}년 ${month}월 ${day}일`;

const openDialog = (type) => {
  dialog.value[type] = true;
};

const LocalWeather = async () => {
  const res = await getWeather();
  console.log('Weather res.data', res.data);
  weather.value = res.data;
  if (weather.value.ncstPty !== '없음') {
    weather.value.villageSky = weather.value.ncstPty;
  }
};

// 한줄 알림
const memberNickName = async () => {
  const res = await getNickName();
  nickName.value = res.data.memberNick;
};
const popMessage = computed(() => {
  const pop = weather.value.villagePop;
  const per = '오늘은 비올 확률이 ' + weather.value.villagePop + '% !!';
  const sky = weather.value.villageSky;
  if ((pop < 10 && sky === '맑음') || (pop < 10 && sky === '구름 많음')) {
    return '오늘의 날씨는 ' + sky + '이네요! 즐거운 하루 보내세요.';
  } else if (
    pop < 30 &&
    (sky === '맑음' || sky === '구름 많음' || sky === '흐림')
  ) {
    return per + '걱정 되신다면 우산을 챙기길 추천해요!';
  } else if (pop < 50 && (sky === '흐림' || sky === '비')) {
    return per + '비가 올 수도 있으니 휴대하기 편한 우산 챙기길 추천해요!';
  } else if (pop < 90 && (sky === '흐림' || sky === '비')) {
    return per + '우산 챙기셨나요? 우산 챙겨가세요!';
  } else if (pop > 90 || sky === '비') {
    return per + '우산을 꼭 챙기고 빗길 조심하세요!';
  } else {
    return '오늘 하루도 화이팅!';
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
  '비/눈': '🌨️',
};

const skyEmoji = computed(() => {
  return (
    skyEmojiList[weather.value?.ncstPty] ||
    skyEmojiList[weather.value?.villageSky]
  );
});

const dayTimes = computed(() => {
  const hour = new Date().getHours();
  let timeName = '';
  if (hour > 6 && hour < 19) return (timeName = 'morning');
  else if (hour < 22) return (timeName = 'evening');
  else return (timeName = 'night');
});

const backgroundImg = {
  '맑음-morning': 'url(/image/weather/clear_morning.jpg)',
  '맑음-evening': 'url(/image/weather/clear_afternoon.jpg)',
  '맑음-night': 'url(/image/weather/clear_night.jpg)',
  '구름 많음-morning': 'url(/image/weather/littlecloudy_morning.jpg)',
  '구름 많음-evening': 'url(/image/weather/littlecloudy.jpg)',
  '구름 많음-night': 'url(/image/weather/littlecloudy_night.jpg)',
  '흐림-morning': 'url(/image/weather/cloudy.jpg)',
  '흐림-evening': 'url(/image/weather/cloudy.jpg)',
  '흐림-night': 'url(/image/weather/cloudy_night.jpg)',
  '비-morning': 'url(/image/weather/rain.jpg)',
  '비-evening': 'url(/image/weather/rain.jpg)',
  '비-night': 'url(/image/weather/rain.jpg)',
  default: 'url(/image/loading.gif)',
};

const weatherBackground = computed(() => {
  const sky = weather.value?.villageSky || '';
  const time = dayTimes.value;
  return backgroundImg[`${sky}-${time}`] || backgroundImg.default;
});

onMounted(async () => {
  memberNickName();
  await LocalWeather();
});

watch(
  () => weatherStore.refresh,
  async () => {
    await LocalWeather();
  }
);
</script>

<template>
  <div class="weather-alert">
    <div v-if="weather">
      <strong>{{
        nickName === '' || nickName === undefined ? '' : nickName + '님~'
      }}</strong
      >{{ popMessage }}
    </div>
    <div v-else>로딩중. . .</div>
  </div>
  <!-- PC날씨 정보 헤더 -->
  <div class="header flex justify-between items-center w-full px-4 pt-2">
    <span class="live px-4 py-1 text-white font-semibold text-sm">
      실시간 날씨 정보
    </span>
    <button @click="toggleMenu" class="menu px-2 py-1 text-sm font-bold">
      ☰ 날씨 메뉴
    </button>
    <button v-if="open" class="menu-list" @click="openDialog('daily')">
      시간별 날씨
      <v-dialog v-model="dialog.daily" max-width="1000" min-height="100">
        <v-card>
          <v-card-title class="text-h8">{{ nowDate }} 날씨</v-card-title>
          <v-card-text>
            <DailyWeather />
          </v-card-text>
        </v-card>
      </v-dialog>
    </button>
    <button v-if="open" class="menu-list" @click="openDialog('location')">
      지역 변경
      <v-dialog v-model="dialog.location" max-width="1000" min-height="200">
        <v-card>
          <v-card-title class="text-h8">지역 저장</v-card-title>
          <v-card-text>
            <Location @close="dialog.location = false" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </button>
  </div>
  <!-- PC날씨 정보 박스 -->
  <div class="d-none d-sm-flex">
    <div class="weather-card" :style="{ backgroundImage: weatherBackground }">
      <div v-if="weather" class="weather-content">
        <div class="weather-left">
          <div class="weather-location">
            {{ weather.localName }}
          </div>
          <div class="condition">
            {{ weather.villageSky }}
            {{ weather.villageSky === '비' ? weather.ncstRh1 + '(mm)' : '' }}
          </div>
        </div>

        <div class="weather-right">
          <div class="warp">
            <div class="weather-icon">{{ skyEmoji }}</div>
            <div class="temperature">
              {{ weather.ncstTem === undefined ? '' : weather.ncstTem + '℃' }}
            </div>
          </div>
          <div class="max_min_temperature">
            {{
              weather.villageTmn === undefined
                ? ''
                : '최저 ' +
                  weather.villageTmn +
                  '° / 최고 ' +
                  weather.villageTmx +
                  '°'
            }}
          </div>
          <div class="humidity">
            {{
              weather.ncstReh === undefined
                ? ''
                : '습도' + weather.ncstReh + '%'
            }}
          </div>
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
  margin: 1rem;
  max-width: 100%;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  color: #333;
  line-height: 1.4;
  user-select: none;

  strong {
    font-weight: bold;
    margin-right: 0.3rem;
  }
}
.header {
  display: flex;

  .live {
    background-color: #3bbeff;
    border-radius: 16px 16px 0 0;
    gap: 0;
    user-select: none;
  }
}

.menu {
  color: #3bbeff;
  background-color: transparent;
  border: none;
}
.menu-list {
  margin-top: 4px;
  color: #ccc;
  padding: 0 1rem 0.1rem;
  border-radius: 16px;
  &:hover {
    background-color: transparent;
  }
}

.weather-card {
  background-size: cover;
  background-position: center;
  border-radius: 0 16px 16px 16px;
  padding: 1rem;
  margin: 0px 1rem;
  height: 11rem;
  color: white;
  width: 100%;
  box-shadow: 1px 1px 4px #838383;
  box-sizing: border-box;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  user-select: none;

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
@media (max-width: 935px) {
  .weather-alert {
    font-size: 1rem;
  }
}
@media (max-width: 802px) {
  .weather-alert {
    font-size: 0.8rem;
  }
}
@media (max-width: 790px) {
  .weather-location {
    font-size: 2rem !important;
  }
  .condition {
    font-size: 1.2rem !important;
  }
  .weather-icon {
    font-size: 2.8rem !important;
  }

  .temperature {
    font-size: 1.8rem !important;
  }
}
@media (max-width: 686px) {
  .weather-location {
    font-size: 1.6rem !important;
  }
  .condition {
    font-size: 1rem !important;
  }
}
@media (max-width: 679px) {
  //   .weather-alert {
  //     font-size: 0.8rem;
  //   }
  // }
  // @media (max-width: 612px) {
  .weather-location {
    font-size: 1.4rem !important;
  }
  .condition {
    font-size: 1rem !important;
  }
  .weather-icon {
    font-size: 2.6rem !important;
  }

  .temperature {
    font-size: 1.6rem !important;
  }
  .weather-alert {
    font-size: 0.6rem;
  }
}
@media (max-width: 573px) {
  .weather-card {
    height: 10rem;
  }
  .weather-location {
    font-size: 1rem !important;
  }
  .weather-right {
    .weather-icon {
      font-size: 1.8rem !important;
    }
    .temperature {
      font-size: 1.2rem !important;
    }
  }
}
@media (max-width: 534px) {
  .weather-alert {
    font-size: 0.5rem;
  }
}
@media (max-width: 522px) {
  .header {
    font-size: 10px;
  }
}
@media (max-width: 498px) {
  .weather-content {
    gap: 0 !important;
  }
}
@media (max-width: 446px) {
  .weather-card {
    height: 8rem;
  }
  .weather-content {
    flex-wrap: nowrap !important;
  }
  .weather-right {
    .weather-icon {
      font-size: 1.4rem !important;
    }
    .temperature {
      font-size: 1rem !important;
    }
    .max_min_temperature,
    .humidity {
      font-size: 0.8rem !important;
    }
  }
}
// vuetify 설정이 안되어 임의로 설정
@media (min-width: 480px) {
  .d-sm-flex {
    display: flex !important;
  }
  .d-sm-none {
    display: none !important;
  }
}
@media (min-width: 768px) {
  .d-md-flex {
    display: flex !important;
  }
  .d-md-none {
    display: none !important;
  }
}
@media (min-width: 1024px) {
  .d-lg-flex {
    display: flex !important;
  }
  .d-lg-none {
    display: none !important;
  }
}
</style>
