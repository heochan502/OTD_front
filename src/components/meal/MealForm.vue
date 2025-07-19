<script setup>
import ProgressBar from './ProgressBar.vue';
import { ref } from 'vue';
const value = ref(60);
const moreMeal = ref(500);
const totalKcal = ref(2000);
const maxKcal = ref(2500);
const tansu = ref(30); // 탄수화물 비율
const protein = ref(40); // 단백질 비율
const jibang = ref(20); // 지방 비율
</script>

<template>



<div class="progress-container">
  <ProgressBar
  class="totalcal"
    :value="value"
    :leftString=" `${totalKcal}/${maxKcal}kcal` "
    :rightString=" `${moreMeal}kcal 더 먹을 수 있어요!` "
    customsize="totalcal"
  />
 
</div >
 <div class="inprogressbar d-flex justify-content-between"> 
      <ProgressBar
      class="tansu"
      :value="tansu"
      :leftString="`탄수화물`"
      :rightString=" `${tansu}%` "
      customsize="tansu"
      />
       <ProgressBar
      class="protein"
      :value="protein"
      :leftString="`단백질`"
      :rightString=" `${protein}%` "
      customsize="protein"
      />
       <ProgressBar
      class="jibang"
      :value="jibang"
      :leftString="`지방`"
      :rightString=" `${jibang}%` "
      customsize="jibang"
      />
  </div>
<!-- 
<div class=" progress-container">
    <div class="progress-wrapper">
        <div class="d-flex justify-content-between">
            <h4 class="totalkcal"> {{totalKcal}}/{{maxKcal}}kcal</h4>
            <h4 class="moreeat">{{moreMeal}}kcal 더 먹을 수 있어요!</h4>
        </div>
    <div>
        <progress
            class="progress"
            id="progress"
            :value="value"
            min="0"
            max="100">
        </progress>
        </div>
    </div> 
</div>-->
<!-- 
<div class="progress bigpro progress-container"
    role="progressbar"
    aria-label="Animated striped example">
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      :style="{ width: value + '%' }"></div>
  </div>
<div class="d-flex test2">
  <v-progress-linear class="test  "  color="blue"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
    </div>
    <div class="d-flex test3 justify-content">
    <v-progress-linear class="test5  "  color="yellow"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
      <v-progress-linear class="test5  "  color="green"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
      <v-progress-linear class="test5  "  color="red"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
    </div>
  <h1>여기서 부터 시작</h1>
  <div
    class="progress-container bigpro"
    role="progressbar"
    aria-label="Animated striped example">
    <div
      class="progress-bar progress-bar-animated text-bg-info"
      :style="{ width: value + '%' }">
      {{ value }}%
    </div>
  </div>
 

  <div class="d-flex miniprogroup">
    <div class="progress-container progress2 minipro">
      <div
        class="progress-bar text-bg-info"
        :style="{ width: value + '%' }"
      ></div>
    </div>
    <div class="progress-container progress3 minipro">
      <div
        class="progress-bar text-bg-info"
        :style="{ width: value + '%' }"
      ></div>
    </div>
    <div class="progress-container progress4 minipro">
      <div
        class="progress-bar text-bg-info"
        :style="{ width: value + '%' }"
      ></div>
    </div>
  </div> -->
</template>

<style scoped>


.progress-container {
  display:flex;
  gap: 0px;
}
.inprogressbar
{  
  width: 40%;
  gap: 1px;             /* ← 항목 사이 간격 조절 */
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 0px;
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


/* .progress-container {
    max-width: 1024px;
    margin: 30px 30px 10px 30px;   
}
.progress-wrapper {
    width: 50%;
    margin: 5px;
    padding: 10px;
}

.totalkcal {
    font-size: 25px;
    color: #000000;
    text-align: left;
    position: relative;
    top: 5px;
}

.moreeat {
    padding-bottom: 0px;
    font-size: 18px;
    color: #ffffff;
    position: relative;
    top: 12px;
    text-align: right;
    font-weight: 400;
}
#progress {
    appearance: none;
    width: 100%;
}
#progress::-webkit-progress-bar {
    background:#cbe7f1;
    border-radius:15px;
    box-shadow: inset 3px 3px 10px #cbe7f1;
}
#progress::-webkit-progress-value {
    border-radius:10px;
    background: #c1e5f3;
    background: -webkit-linear-gradient(to right, #88a0ec, #305ff8);
    background: linear-gradient(to right, #88a0ec, #305ff8);

} */
/* .progress-container {
  margin: 30px;
  width: 50%;
  height: 20px;
  border: 0.1px solid rgb(122, 120, 120);
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
}
.progress-container:last-child {
  margin-right: 0;
}
.bigpro {
  margin: 30px 30px 30px;
}
.minipro {
  margin: 10px;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease-in-out;
}
.progress2 {
  width: 14%;
  margin: 10px 30px 30px 45px;
}
.progress3 {
  width: 14%;
}
.progress4 {
  width: 14%;
}
.test{
  width: 50%;
  background-color: #fff;
  border-radius: 15px;
  border: 0.1px solid rgb(122, 120, 120);
}
.test5{
  width: 16%;
  background-color: #fff;
  border-radius: 15px;
  border: 0.1px solid rgb(122, 120, 120);
}

.test2 {
  margin: 30px;
  
}
.test3 {
  margin: 30px 30px 30px 31px ;
  display: grid;
  grid-template-columns: 1fr 1fr;  
  grid-gap: 10px;
  
  
} */
/* 

  #progress {
        position: absolute;
        margin-bottom: 17px;
        appearance: none;
      }
      
      #progress::-webkit-progress-bar {
        background: #e5eaec;
        border-radius: 12px;
        border: 1px solid #eeeeee;
        height: 28px;
        width: 200px;
        overflow: hidden;
      }

      #progress::-webkit-progress-value {
        background: #c2dbe2;
        border-radius: 0px;
        height: 28px;
        width: 48px;
      } */


</style>
