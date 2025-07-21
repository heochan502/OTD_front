<script setup>
import ProgressBar from '@/components/meal/ProgressBar.vue';
import WeeklyCalorie from '@/components/meal/WeeklyCalorie.vue';
import { ref, reactive, onMounted } from 'vue';
const value = ref(10);
const moreMeal = ref(500);
const totalKcal = ref(2000);
const maxKcal = ref(2500);
const tansu = ref(30); // 탄수화물 비율
const protein = ref(40); // 단백질 비율
const jibang = ref(20); // 지방 비율

// const screenSize = reactive({
//   width: window.innerWidth,
//   height: window.innerHeight,
// });
// const handleResize = () => {
//   screenSize.width = window.innerWidth;
//   screenSize.height = window.innerHeight;
// };

// const myDiv = ref(null);
// const divWidth = ref(0);
// const divHeight = ref(0);

onMounted(() => {
  
  // const div = myDiv.value;
  // if (div) {
  //   const rect = div.getBoundingClientRect();
  //   divWidth.value = rect.width;
  //   divHeight.value = rect.height;
  //   console.log('너비:', divWidth.value, '높이:', divHeight.value);
  // }
});
</script>

<template>
  <!-- <div ref="myDiv"> -->
  <!-- 내용
    너비: {{ divWidth }} / 높이: {{ divHeight }} -->

  <div id="mealForm" class="main-container" >
    <div class="left">
      <div class="progress-container w-full">
        <ProgressBar
          class="totalcal"
          :value="value"
          :leftString="`${totalKcal}/${maxKcal}kcal`"
          :rightString="`${moreMeal}kcal 더 먹을 수 있어요!`"
          customsize="totalcal"
        />
        <div class="inprogressbar">
          <ProgressBar
            class="tansu"
            :value="tansu"
            :leftString="`탄수화물`"
            :rightString="`${tansu}%`"
            customsize="tansu"
          />
          <ProgressBar
            class="protein"
            :value="protein"
            :leftString="`단백질`"
            :rightString="`${protein}%`"
            customsize="protein"
          />
          <ProgressBar
            class="jibang"
            :value="jibang"
            :leftString="`지방`"
            :rightString="`${jibang}%`"
            customsize="jibang"
          />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="dailymeal">
        <button class="btn btn-primary mealsaday" @click="value += 10">
          <span>아침</span> <span>✚</span>
        </button>
        <button class="btn btn-primary mealsaday" @click="value += 10">
          <span>점심</span> <span>✚</span>
        </button>
        <button class="btn btn-primary mealsaday" @click="value += 10">
          <span>저녁</span> <span>✚</span>
        </button>
      </div>
    </div>
    <div class="bottom " >
      <WeeklyCalorie />
    </div>
  </div>
  <!-- </div> -->
</template>

<style scoped>
#mealForm {
  padding-top: 1px;
  padding-left: 10px;
  width: 100%;  
  position: relative;
}

#mealForm .left {
  width: 50%;
  height: 50%;
  float: left;
  margin-top: 5px;
}

#mealForm .right {
  height: 50%;
  width: 50%;
  float: right;
}
#mealForm .bottom {
  width: 100%;
  height: 100%;
  margin-top: 15%;
  margin-left: -20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;

}


.dailymeal {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
}
.mealsaday {
  width: 300px;
  margin-left: 60px;
  height: 50px;
  font-size: 20px;
  background-color: #3bbeff;
  color: white;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 30px;
}

.main-container > .test {
  text-align: center;
  position: relative;
  margin-bottom: 10px;
}

.progress-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0px;
}

.inprogressbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 1px;
  /* ← 항목 사이 간격 조절 */
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 0px;
}

.totalkcal {
  font-size: 25px;
  color: #000000;
  text-align: left;
  top: 5px;
  width: 500px;
  display: flex;
  height: 30px;
}

.tansu {
  margin: 0px 0px 0px 30px;
  padding: 0px;
}

.protein {
  margin: 0px 0px 0px 0px;
  padding: 0px;
}

.jibang {
  margin: 0px 0px 0px 0px;
  padding: 0px;
}
</style>
