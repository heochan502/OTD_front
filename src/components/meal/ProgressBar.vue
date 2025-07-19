<script setup>
defineProps({
    value:Number,   
    leftString:String,
    rightString:String,
    customsize : String,
});

</script>


<template>
<div>
    <div class="progress-wrapper">
        <div class="bar-header  d-flex justify-content-between"> 
            <span :class="customsize"> {{leftString}}</span>
            <span class="moreeat">{{rightString}}</span>
        </div>
        <div >
        
            <progress
                :class="`progress ${customsize} `"                
                :value="value"
                min="0"
                max="100">
            </progress>
        </div>
    </div>
</div>
</template>


<style scoped>


.tansu {    font-size: 20px;
    color: #ff6b6b ;
       .progress::-webkit-progress-bar {
        background: #ffffff;
        border-radius: 15px;
        box-shadow: inset 3px 3px 10px #ffffff;
    }
    .progress::-webkit-progress-value {
        border-radius: 15px;
        background: #ffffff;
        background: -webkit-linear-gradient(to right, #ffffff, #ffffff);
        background: linear-gradient(to right, #ff8787, #ff6b6b);
    }
}
.protein {    font-size: 20px;
    color: #4dabf7;
    .progress {
    appearance: none;
    border-radius: 15px;
    height: 15px;
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
.jibang {    font-size: 20px;
    color: #ffd43b;
    .progress {
    appearance: none;
    border-radius: 15px;
    height: 15px;
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
    inline-size: 650px;
    font-size: 30px;  
    top: 0px;
    font-weight: 500;
}
.bar-header {
  padding: 0px 0px 0px 10px; 
  
    font-family : 'Noto Sans KR', sans-serif;
  justify-content: space-between; /* 양쪽 정렬 유지 */
  align-items: center;
 
}
.moreeat {
    font-size: 18px;
    color: #000000;   /* 텍스트 색상 변경 */
    font-weight: 400;
    
    size: 100%;
    white-space: nowrap; /* 줄바꿈 방지 */
 }
.progress-wrapper {
    padding: 10px 0px 0px 10px;
}

.progress {
    appearance: none;
    border-radius: 15px;
    height: 23px;
}
.progress::-webkit-progress-bar {
    background:#cbe7f1;
    border-radius:15px;
    box-shadow: inset 3px 3px 10px #cbe7f1;
    border: 1.5px solid black;
}
.progress::-webkit-progress-value {
    border-radius:15px;
    background: #c1e5f3;
    background: -webkit-linear-gradient(to right, #88a0ec, #305ff8);
    background: linear-gradient(to right, #88a0ec, #305ff8);
}

</style>