<script setup>
import ProgressBar from '@/components/meal/ProgressBar.vue';
import WeeklyCalorie from '@/components/meal/WeeklyCalorie.vue';
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  nextTick,
  watchEffect,
} from 'vue';
import { useHealthStore } from '@/stores/healthStore';
import { getProfile } from '@/services/member/accountService';
import { useRouter } from 'vue-router';
import {
  useDayDefine,
  useCalorieCalcul,
  useWeeklyStore,
  useBaseDate,
  useClickProgressBar,
} from '@/stores/mealStore';
import MealStatistic from '@/components/meal/MealStatistic.vue';
import dayjs from 'dayjs';

import 'dayjs/locale/ko';

dayjs.locale('ko');

const healthData = useHealthStore();
const dayStore = useDayDefine();
const ondayMealData = useCalorieCalcul();
const weeklyData = useWeeklyStore();
const baseDate = useBaseDate();
const clickProgress = useClickProgressBar();

// 권장 칼로리 일주일치 가져와서 평균치 냄
const makeTotalCalorie = async () => {
  // 회원의 몸무게 키 나이를 가져와서 칼로리 계산을 하는 거
  const res = await getProfile();
  // 피니아에 health 관련 정보 가져옴
  console.log('헬스데이타 로그 : ', healthData.logs);
  console.log('회워정보 로그 : ', res.data);

  //   const totalPrice = items.reduce((sum, item) => {
  //   return sum + item.price; // 각 item의 price 값을 sum에 더함
  // }, 0); // 초기값은 0

  const weightSum = healthData.logs.reduce(
    (acc, current) => acc + current.weight,
    0
  );

  const heightSum = healthData.logs.reduce(
    (acc, current) => acc + current.height,
    0
  );

  const currentDay = new dayjs();
  const birthDate = dayjs(res.data.birthDate, 'YYYYMMDD');

  const resultAge = () => {
    let age = currentDay.year() - birthDate.year();

    if (
      currentDay.month() < birthDate.month() ||
      (currentDay.month() === birthDate.month() &&
        currentDay.date() < birthDate.date())
    ) {
      age--;
    }
    return age;
  };

  const avgHelth = {
    weight: weightSum / healthData.logs.length,
    height: heightSum / healthData.logs.length,
    age: resultAge(),
    gender: res.data.gender, // 1은 남자 2 는 여자
  };

  let result = 0;
  if (avgHelth.gender === 'M') {
    // 권장 칼로리 계산 법 남자: 66.47 + (13.75 × 체중) + (5 × 키) - (6.76 × 나이)
    result =
      66.47 +
      13.75 * avgHelth.weight +
      5 * avgHelth.height -
      6.76 * avgHelth.age;
  } else {
    // 권장 칼로리 계산법 여자: 655.1 + (9.56 × 체중) + (1.85 × 키) - (4.68 × 나이)
    result =
      655.1 +
      9.56 * avgHelth.weight +
      1.85 * avgHelth.height -
      4.68 * avgHelth.age;
  }
  return Math.trunc(result);
};

const maxKcal = ref(null);

const router = useRouter();

const mealadd = (day) => {
  dayStore.dayDefine = day;
  router.push({ name: 'MealAdd' });
  // itemInfo
};

// 화면 뿌려질떄는 데이터가 없어서 터지는거 방지
// 여기서 과거 데이터 보여주는거 고쳐야함
const calorieData = computed(() => {
  const info = ondayMealData.itemInfo;

  // null, undefined, 배열 길이 체크
  if (info) {
    // console.log("칼로리 데이터:", info);
    return info;
  }
  return {
    allDayCalorie: 0,
    mealDay: new dayjs().format('YYYY년 MM월 DD일 dddd'),
    totalFat: 0,
    totalCarbohydrate: 0,
    totalProtein: 0,
  };
});

const total = ref(0);
const avg = ref(0);

onMounted(async () => {
  // console.log('totalKcal:', ondayMealData.itemInfo.mealDay);
  // console.log('지금 시간:', new dayjs().format('YYYY-MM-DD'));
  // 초기 데이터 없으면 현재 시간으로 설정/ 있으면 그전 데이터로 출력
  await nextTick();
  if (
    !ondayMealData.itemInfo.mealDay ||
    ondayMealData.itemInfo.mealDay === ''
  ) {
    await ondayMealData.mealFormData(new dayjs().format('YYYY-MM-DD'));
  } else {
    await ondayMealData.mealFormData(ondayMealData.itemInfo.mealDay);
  }
  await healthData.fetchHealthlogs();
  maxKcal.value = await makeTotalCalorie();
  console.log('맥스 칼로리', maxKcal);
});

watch(
  () => weeklyData.weeklyRawData,
  (newData) => {
    if (newData.length !== 0) {
      total.value = newData.reduce((sum, day) => sum + day.totalCalorie, 0);
      avg.value = total.value / newData.length;
    } else {
      avg.value = 0;
    }
  },
  { immediate: true, deep: true }
);
const formatNumber = (num) => {
  if (num === null || num === undefined) return 0;
  return Number(num).toLocaleString();
};

const clickProgressBar = (category) => {
  clickProgress.nowProgress(category);
  // console.log(clickProgress.nowCategory);
};
</script>

<template>
  <div id="mealForm" class="main-container flex-column">
    <div class="meal-layout mt-0 pt-0 gt-0">
      <div class="left_progress">
        <div class="progress-container w-full">
          <span class="totalkcal text-h6 font-weight-black"
            >{{ calorieData.mealDay }} 칼로리</span
          >
          <ProgressBar
            class="totalcal"
            :value="calorieData.allDayCalorie"
            :leftString="`${formatNumber(
              calorieData.allDayCalorie
            )}/${formatNumber(maxKcal)}kcal`"
            :rightString="`${formatNumber(
              maxKcal - calorieData.allDayCalorie
            )}kcal 더 먹을 수 있어요!`"
            :max="maxKcal"
            customsize="totalcal"
            @click="clickProgressBar(0)"
          />
          <div class="inprogressbar d-flex justify-content-between">
            <ProgressBar
              class="tansu"
              :value="calorieData.totalCarbohydrate"
              :leftString="`탄수화물`"
              :rightString="`${(
                (calorieData.totalCarbohydrate / ((maxKcal * 0.6) / 4)) *
                100
              ).toFixed(1)}%`"
              :max="(maxKcal * 0.6) / 4"
              customsize="tansu"
              @click="clickProgressBar(1)"
            />
            <ProgressBar
              class="protein"
              :value="calorieData.totalProtein"
              :leftString="`단백질`"
              :rightString="`${(
                (calorieData.totalProtein / ((maxKcal * 0.15) / 4)) *
                100
              ).toFixed(1)}%`"
              customsize="protein"
              :max="(maxKcal * 0.15) / 4"
              @click="clickProgressBar(2)"
            />
            <ProgressBar
              class="jibang"
              :value="calorieData.totalFat"
              :leftString="`지방`"
              :rightString="`${(
                (calorieData.totalFat / ((maxKcal * 0.25) / 9)) *
                100
              ).toFixed(1)}%`"
              customsize="jibang"
              :max="(maxKcal * 0.25) / 9"
              @click="clickProgressBar(3)"
            />
          </div>
        </div>
      </div>

      <div class="right_button">
        <!-- <div class="dailymeal border"> -->
        <button
          class="btn btn-primary mealsaday font-weight-black text-body-3"
          @click="mealadd('아침')"
        >
          <span>아침</span> <span>✚</span>
        </button>
        <button
          class="btn btn-primary mealsaday font-weight-black text-body-3"
          @click="mealadd('점심')"
        >
          <span>점심</span> <span>✚</span>
        </button>
        <button
          class="btn btn-primary mealsaday font-weight-black text-body-3"
          @click="mealadd('저녁')"
        >
          <span>저녁</span> <span>✚</span>
        </button>
        <!-- </div> -->
      </div>
    </div>
    <div class="weeky-title  h-100 ml-0 pl-0 ">
      <div class="title d-flex justify-content-between ml-0 pl-0 position-relative">
        <div class="d-flex flex-column mb-0 pb-0">
          <span class="main-title text-h6"> 주간 기록 </span>
          <span class="sub-title text-subtitle-1 "
            >{{ baseDate.getWeekDate.startDate }} 부터
            {{ baseDate.getWeekDate.endDate }} 평균
            {{ Math.round(avg).toLocaleString() }}kcal 먹었어요</span
          >
        </div>
        <div class=" position-absolute top-0 right-0 pa-3  ">
          <MealStatistic />
        </div>
      </div>
      <div class="e_chart d-flex justify-content-end h-100">
        <WeeklyCalorie />
      </div>
    </div>
    
  </div>

  <!-- </div> -->
</template>

<style scoped>
#mealForm {
  display: flex;
  height: 100vh;
  padding-left: 10px;
  padding-top: 10px;
  width: 100%;
  position: relative;
}

.left_progress {
  width: 70%;
  /* height: 50%; */
  /* float: left; */

  margin-top: 5px;
}

.right_button {
  /* height: 50%; */
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
  margin-top: 40px;
  margin-left: 100px;
  /* float: right; */
}

.meal-layout {
  display: flex;
  flex-direction: row;
  flex: none;
  width: 100%;
  justify-content: space-between;
}

.mealsaday {
  width: 100%;
  height: 70px;
  background-color: #3bbeff;
  color: white;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 50px;
}

.progress-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  margin-top: 20px;
}

.inprogressbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 10px;
  /* ← 항목 사이 간격 조절 */
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 0px;
}

.weeky-title {
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  gap: 10px;
  margin-bottom: 0px;
  margin-top: 10px;
}

.main-title {
  font-weight: bold;
  /* font-size: 30px; */
}

.sub-title {
  margin-left: 10px;
  /* font-size: 16px; */
  font-weight: 500;
  color: #333;
}

.totalkcal {
  font-size: 25px;
  color: #000000;
  text-align: left;
  top: 5px;
  display: flex;
  height: 30px;
}

.tansu {
  margin: 0px 0px 10px 30px;
  padding: 0px;
}

.protein {
  margin: 0px 0px 10px 0px;
  padding: 0px;
}

.jibang {
  margin: 0px 0px 10px 0px;
  padding: 0px;
}
</style>
