<script setup>
import { number } from 'echarts';
import { ref, reactive, onMounted } from 'vue';

defineProps({
  value: Number,
  max: Number,
  leftString: String,
  rightString: String,
  customsize: String,
});
// onMounted(() => {
//     console.log('totalKcal2:', value.value);
//     console.log('maxKcal2:', maxKcal.value);
// });
</script>

<template>
  <div>
    <div class="progress-wrapper">
      <div :class="`bar-header ${customsize !== 'totalcal' ? 'optional-progressText' : 'totalcal_text'} text-sm-h6 text-subtitle-1 font-md-weight-medium` ">
        <span :class="`${customsize} text-sm-h6 text-subtitle-1 font-md-weight-medium`"> {{ leftString }}</span>
        <span class="moreeat text-sm-h6 text-subtitle-1 font-md-weight-medium">{{ rightString }}</span>
      </div>
      <div>
        <progress :class="`progress ${customsize} ${customsize !== 'totalcal' ? 'optional-progress' : 'totalcal'}`"
          :value="value" min="0" :max="max"></progress>
      </div>
    </div>
  </div>
</template>

<style scoped>


.tansu {    
    
    margin-top: 5px;
    color: #ff6b6b ;
    width:  100%;

    .progress {
    appearance: none;
    border-radius: 15px;
    height: 25px;
    }
       .progress::-webkit-progress-bar {            
        background: #ffffff;
        border-radius: 15px;        
        box-shadow: inset 3px 3px 10px #ffffff;
    }
    .progress::-webkit-progress-value {
        border-radius: 15px;
        background: #ff6b6b ; 
        background: -webkit-linear-gradient(to right, #ff6b6b, #ff6b6b );
        background: linear-gradient(to right, #ff8787, #ff6b6b);
    }
  }

.protein {    
   
    margin-top: 5px;
    color: #4dabf7;
    width:  100%;
    margin-left: 8px;

    .progress {
    appearance: none;
    border-radius: 15px;
    height: 25px;

    
    }
    
    
    .progress::-webkit-progress-bar {
        background: #fafafa;
        border-radius: 15px;
        box-shadow: inset 3px 3px 10px #ffffff;
    }
    .progress::-webkit-progress-value {
        border-radius: 15px;
        background: #ffffff;
        background: -webkit-linear-gradient(to right, #ffffff, #ffffff);
        background: linear-gradient(to right, #74c0fc, #4dabf7);
    }
}
.jibang {    
   
    color: #ffd43b;
    margin-top: 5px;
    width:  100%;
    margin-left: 15px;

    .progress {
    appearance: none;
    border-radius: 15px;
    height: 25px;
    }
    
    
    .progress::-webkit-progress-bar {
        background: #ffffff;
        border-radius: 15px;
        box-shadow: inset 3px 3px 10px #ffffff;
    }
    .progress::-webkit-progress-value {
        border-radius: 15px;
        background: #ffffff;
        background: -webkit-linear-gradient(to right, #ffffff, #ffffff);
        background: linear-gradient(to right, #ffe066, #ffd43b);
    }
}
.totalcal {    
    margin-left: 10px;
    inline-size: 100%; 
    top: 0px;
}
.bar-header {
  padding: 0px 0px 0px 10px;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  justify-content: space-between; /* 양쪽 정렬 유지 */
  align-items: center;
}
.moreeat {
  margin-bottom: -5px;
  color: #000000; /* 텍스트 색상 변경 */
  
  size: 100%;
  white-space: nowrap; /* 줄바꿈 방지 */
}
.progress-wrapper {
  padding: 10px 0px 0px 0px;
 
}




.progress {
  appearance: none;
  border-radius: 15px;
  height: 30px;  
  margin-top: 5px;
}
.progress::-webkit-progress-bar {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: inset 3px 3px 10px #f7f7f7;
  border: 1.5px solid black;
}
.progress::-webkit-progress-value {
  border-radius: 15px;
  background: #ffffff;
  background: -webkit-linear-gradient(to right, #88a0ec, #305ff8);
  background: linear-gradient(to right, #88a0ec, #305ff8);
}
/* 반응형 */
@media (max-width: 768px) {
  .optional-progress {    
    display: none;
  }
 
}
@media (max-width:530px) {

  .optional-progressText ,
  .totalcal_text {      
    display: grid;
    justify-content: center ;
    /* 자식 요소들을 수직 중앙에 정렬 */ 
    /* align-items: center;  */
    /* 자식 요소들을 수직 중앙에 정렬 */
    .moreeat{
      margin-left: 10px;      
    }
  }
  .totalcal_text{
    /* float: right; */
    margin-bottom: 5px;    
    .totalcal{
     text-align: right;
     padding-right: 14px;
     margin-bottom: -6px;
    }
  }
  .totalcal
  {
    margin: 5px;
  }
  
}
</style>