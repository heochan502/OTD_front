<script setup>
import ProgressBar from '@/components/meal/ProgressBar.vue';
import WeeklyCalorie from '@/components/meal/WeeklyCalorie.vue';
import { ref, reactive, onMounted } from 'vue';
const value = ref(10);
const moreMeal = ref(500);
const totalKcal = ref(300);
const maxKcal = ref(2500);
const tansu = ref(1000); // 탄수화물 비율
const protein = ref(40); // 단백질 비율
const jibang = ref(400); // 지방 비율

onMounted(() => {
  console.log('totalKcal:', totalKcal.value);
  console.log('maxKcal:', maxKcal.value);
});
</script>

<template>
  <div id="mealForm" class="main-container">
    <div class="meal-layout">
      <div class="left">
        <div class="progress-container w-full">
          <ProgressBar class="totalcal" :value="totalKcal" :leftString="`${totalKcal}/${maxKcal}kcal`"
            :rightString="`${moreMeal}kcal 더 먹을 수 있어요!`" :max="maxKcal" customsize="totalcal" />
          <div class="inprogressbar">
            <ProgressBar class="tansu" :value="tansu" :leftString="`탄수화물`" :rightString="`${(tansu / (maxKcal * 0.6) * 100).toFixed(1)}%`" :max="maxKcal*0.6"
              customsize="tansu" />
            <ProgressBar class="protein" :value="protein" :leftString="`단백질`" :rightString="`${protein}%`"
              customsize="protein" :max="maxKcal * 0.15" />
            <ProgressBar class="jibang" :value="jibang" :leftString="`지방`" :rightString="`${jibang}%`"
              customsize="jibang" :max="maxKcal * 0.25" />
          </div>
        </div>
      </div>

      <div class="right">
        <div class="dailymeal">
          <button class="btn btn-primary mealsaday" @click="totalKcal += 10">
            <span>아침</span> <span>✚</span>
          </button>
          <button class="btn btn-primary mealsaday" @click="totalKcal += 20">
            <span>점심</span> <span>✚</span>
          </button>
          <button class="btn btn-primary mealsaday" @click="totalKcal -= 10">
            <span>저녁</span> <span>✚</span>
          </button>
        </div>
      </div>
    </div>
    <div class="weeky-title">
      <span class="main-title"> 주간 기록 </span>
      <span class="sub-title">이번주에 평균 {{ value }}kcal 먹었어요</span>
    </div>
    <div class="bottom">
      <WeeklyCalorie />
    </div>
  </div>

  <!-- </div> -->
</template>

<style scoped>

#mealForm {
  display: flex;
  flex-direction: column;
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
  font-size: 25px;
  background-color: #3bbeff;
  color: white;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 1000;
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

.weeky-title{
  
  font-family : 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.main-title{
  font-weight: bold;
  font-size: 30px;

}
.sub-title{
  margin-left: 10px;
  font-size: 16px;
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
