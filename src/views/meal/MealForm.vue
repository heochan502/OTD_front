<script setup>
import ProgressBar from '@/components/meal/ProgressBar.vue';
import WeeklyCalorie from '@/components/meal/WeeklyCalorie.vue';
import { ref, reactive, onMounted,computed ,watch} from 'vue';
import {useRouter} from "vue-router";
import { useDayDefine, useCalorieCalcul, useWeeklyStore, useBaseDate } from "@/stores/mealStore";



const dayStore = useDayDefine();
const ondayMealData = useCalorieCalcul();
const weeklyData = useWeeklyStore();
const baseDate = useBaseDate();

const maxKcal = ref(2500);

const router = useRouter();

const  mealadd = (day)=>{
  dayStore.dayDefine = day;
  router.push({name : 'MealAdd'});
  // itemInfo
};

// 화면 뿌려질떄는 데이터가 없어서 터지는거 방지
const calorieData = computed(() => {
  const info = ondayMealData.itemInfo;
  // null, undefined, 배열 길이 체크
  if (Array.isArray(info) && info.length > 0 && info[0]?.allDayCalorie !== undefined) {
    return info[0];
  }
  return {
    allDayCalorie: 0,
    mealDay: '',
    totalFat: 0,
    totalCarbohydrate: 0,
    totalProtein: 0,
  };
});
const total = ref(0);
const avg =ref(0);
onMounted(async() => {
  // console.log('totalKcal:', totalKcal.value);
  // console.log('maxKcal:', maxKcal.value);  
   await ondayMealData.mealFormData();
   
  console.log("정보 데이터 :", weeklyData.weeklyRawData);
  

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
const formatNumber = (num) => num.toLocaleString();
</script>

<template>
  <div id="mealForm" class="main-container flex-column">
    <div class="meal-layout">
      <div class="left">
        <div class="progress-container w-full">
            <ProgressBar class="totalcal" :value='calorieData.allDayCalorie'
              :leftString="`${formatNumber(calorieData.allDayCalorie)}/${formatNumber(maxKcal)}kcal`"
            :rightString="`${formatNumber(maxKcal - calorieData.allDayCalorie )}kcal 더 먹을 수 있어요!`" :max="maxKcal"
            customsize="totalcal" />
          <div class="inprogressbar">
            <ProgressBar class="tansu" :value="calorieData.totalCarbohydrate" :leftString="`탄수화물`"
              :rightString="`${(calorieData.totalCarbohydrate/ ((maxKcal * 0.6)/4) * 100).toFixed(1)}%`"
              :max="(maxKcal * 0.6)/4" customsize="tansu" />
            <ProgressBar class="protein" :value="calorieData.totalProtein" :leftString="`단백질`"
              :rightString="`${(calorieData.totalProtein/ ((maxKcal * 0.15)/4) * 100).toFixed(1)}%`"
              customsize="protein" :max="(maxKcal * 0.15)/4" />
            <ProgressBar class="jibang" :value="calorieData.totalFat" :leftString="`지방`"
              :rightString="`${(calorieData.totalFat/ ((maxKcal * 0.25) / 9) * 100).toFixed(1)}%`" customsize="jibang"
              :max="(maxKcal * 0.25)/9" />
          </div>
        </div>
      </div>

      <div class="right">
        <div class="dailymeal">
          <button class="btn btn-primary mealsaday font-weight-black text-body-3" @click="mealadd('아침')">
            <span>아침</span> <span>✚</span>
          </button>
          <button class="btn btn-primary mealsaday font-weight-black text-body-3" @click="mealadd('점심')">
            <span>점심</span> <span>✚</span>
          </button>
          <button class="btn btn-primary mealsaday font-weight-black text-body-3" @click="mealadd('저녁')">
            <span>저녁</span> <span>✚</span>
          </button>
        </div>
      </div>
    </div>
    <div class="weeky-title">
      <span class="main-title text-h6"> 주간 기록 </span>
      <span class="sub-title text-subtitle-1">{{baseDate.getWeekDate.startDate}} 부터 {{baseDate.getWeekDate.endDate}} 평균 {{ Math.round(avg).toLocaleString() }}kcal 먹었어요</span>
      
      <div class=" d-flex  justify-content-end ">
      <WeeklyCalorie class="" />
    </div>
    </div>
    <div class="bottom ">

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
  padding-left: 10px;
  gap: 10px;
  width: 100%;
  position: relative;
}

#mealForm .left {
  width: 50%;
  /* height: 50%; */
  /* float: left; */

  margin-top: 5px;
}

#mealForm .right {
  /* height: 50%; */
  width: 50%;
  /* float: right; */
}
#mealForm .bottom {
  width: 100%;
  /* height: auto; */
  margin-top: auto;
  margin-left: -20px;
}

.meal-layout {
  display: flex;
  flex-direction: row;
  flex: none;
  width: 100%;
}

.dailymeal {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  margin-top: 40px;
  margin-left: 100px;
}
.mealsaday {
  width: 350px;
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
  gap: 30px;
  margin-top: 20px;
}

.inprogressbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 10px;
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
  margin-bottom: 10px;
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
