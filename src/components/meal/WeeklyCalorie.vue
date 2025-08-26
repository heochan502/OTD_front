<script setup>
import { onMounted, ref, nextTick, reactive, watch } from 'vue';

import { useBaseDate, useWeeklyStore, useCalorieCalcul , useClickProgressBar} from '@/stores/mealStore';
import { getWeekTotal } from '@/services/meal/mealService'
import MealStatistic from './MealStatistic.vue';

import * as echarts from 'echarts';

import dayjs from 'dayjs';

import 'dayjs/locale/ko';

dayjs.locale('ko');

const clickProgress = useClickProgressBar();
const ondayMealData = useCalorieCalcul();
const weeklyStore = useWeeklyStore();


const weekDay = useBaseDate();
const len = 7;
// const xData = ['월', '화', '수', '목', '금', '토', '일'];
const xData = {
  dates: [],
  dayName: ['월', '화', '수', '목', '금', '토', '일'],
  totalCalorie : Array(len).fill(0),
  totalFat : Array(len).fill(0),
  totalCarbohydrate : Array(len).fill(0),
  totalProtein : Array(len).fill(0),
};




// const yData = Array(xData.dayName.length).fill(0);
// const yData = ['totalCalorie', 'totalFat', 'totalCarbohydrate', 'totalProtein']
//   .reduce((acc, key) => ({ ...acc, [key]: Array(len).fill(0) }), {})

/*const yData= {
// 탄 * 4 단 * 4 지 * 9  
  totalCalorie: Array(len).fill(0),
  totalFat: Array(len).fill(0),
  totalCarbohydrate: Array(len).fill(0),
  totalProtein: Array(len).fill(0),

}
// 위랑 아래랑 같은 식 
const yData = ['totalCalorie', 'totalFat', 'totalCarbohydrate', 'totalProtein']
  .reduce((acc, key) => ({ ...acc, [key]: Array(len).fill(0) }), {})
*/


const getDayName = (dateString) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateString);
  // console.log("요일 : ", date.getDay());
  // console.log("요일 : ", days[date.getDay()]);
  return days[date.getDay()];
};



const chartRef = ref(null); // 차트 DOM 요소 참조
let myChart = null; // ECharts 인스턴스

const option = {

  title: {
    text: `주간 총 ${clickProgress.nowCategory} 통계`,
  },
  // 차트 옵션 설정
  //마우스 올렸을때 나오는 정보값
  tooltip: {


    dataZoom: [
            {
              show: false, // DataZoom 기능 비활성화
                // 또는 show: false 로 설정 가능
            }
        ],
    trigger: 'axis',
    // 마우스 오버 했을때 나오는 정보
    formatter: function (params) {
      // 막대 그래프는 일반적으로 하나만 있어서 params[0] 사용
      const data = params[0];
      // 아래 toLocaleString 터지는 거 방지 
      data.data = data.data ? data.data : 0;
      // data.marker는 색상 표시
      // data.data는 해당 데이터 값
      // data.axisValue는 x축의 값
      // console.log("params:", params);
      return `${xData.dates[params[0].dataIndex]}  <br /> ${data.axisValue}요일 <br />${data.marker} ${data.data.toLocaleString()} kcal`;
    },
  },
  legend: {
    show: false,
    top: 'top',
    left: 'center',
    textStyle: {
      color: '#ffffff', // 텍스트 색상
      fontSize: 14,
      fontWeight: 'bold',
    },
  },
  // 범례 설정
  xAxis: {
    type: 'category',
    data: xData.dayName,
    axisLabel: {
      color: '#000000', // 텍스트 색상
      fontSize: 14, // 글자 크기
      fontWeight: 'bold',
    },
    axisLine: {
      lineStyle: {
        color: 'none', // 축 색상
        width: 1,
        show: false,
      },
    },
    triggerEvent: true,
  },
  yAxis: {
    type: 'value',             
    axisLabel: {
      color: '#000000',
      fontSize: 12,
      fontWeight: 'bold',
      formatter: '{value} kcal',
      show:false, // y축 숨기 표시
    },   
    splitLine: {
      lineStyle: {
        color: '#cccccc', // 눈금선 색상
        type: 'dashed', // 점선으로 표시
        
      },
    },
    triggerEvent: true,
  },
  // 차트 스타일 설정
  series:
  {
    name: '',
    type: 'bar',
    seriesLayoutBy: 'row',
     // y축 데이터와 x축 날짜를 결합
    // 막대그래프 스타일 설정
    data: xData.totalCalorie,
    barWidth: '50%',     
    itemStyle: {
      borderRadius: [30, 30, 0, 0],
      color: '#D9D9D9',
      animation: true, // 기본 애니메이션
      animationDuration: 5000, // 초기 진입 애니메이션 시간
      // animationDurationUpdate: 5000, //  데이터 업데이트 시 애니메이션 시간
      animationDelay: 500, // 애니메이션 지연 시간
      // animationEasing: 'elasticOut', // 애니메이션 효과
      // animationDelay: (idx) => idx * 100, // 각 막대마다 애니메이션 지연 시간
    },
    triggerEvent: true,
  },

  graphic: {
    type: 'text',
    right: '5%',
    top: 10,
    style: {
      text: 'Kcal',
      fontSize: '25px Noto Sans KR sans-serif',
      fill: '#ffffff',
   
    },
    
  },
};


const getStatistic = async (weeky) => {
  const res = await getWeekTotal(weeky);
  // console.log("weeky:", weeky);
  if (res.status === 200) {
    weeklyStore.weeklyRawData = res.data;
  }

  // 기존 y축 데이터 0으로 만드는격 
  // const yDataTemp = Array(xData.dayName.length).fill(0);
  // console.log("weeklyStore.weeklyRawData:", weeklyStore.weeklyRawData);

  xData.dates= weeklyStore.weekyDate; // 날짜 추가
  // 주간 데이터 없으면 배열 데이터 초기화
 if (!weeklyStore.weeklyRawData.length){
  xData.totalCalorie = Array(xData.dayName.length).fill(0);
  xData.totalFat = Array(xData.dayName.length).fill(0);
  xData.totalCarbohydrate = Array(xData.dayName.length).fill(0);
  xData.totalProtein = Array(xData.dayName.length).fill(0);
 }

  weeklyStore.weeklyRawData.forEach(item => {
    const dayName = getDayName(item.mealDay); // '화', '수', ...

    const index = xData.dayName.indexOf(dayName);      // 요일 인덱스 찾기   
    if (index !== -1) {
      // console.log("item.mealDay: {}, index : {}", item.mealDay, index);
      xData.totalCalorie[index] = item.totalCalorie; // 해당 요일 자리에 값 대입
      xData.totalFat[index] = item.totalFat * 9; // 지방 * 9
      xData.totalCarbohydrate[index] = item.totalCarbohydrate * 4; // 탄수화물 * 4
      xData.totalProtein[index] = item.totalProtein * 4; // 단백질 * 4

      // xData.dates[index] = item.mealDay; // 날짜 추가
      // yDataTemp[index] = item.totalCalorie;       // 해당 요일 자리에 값 대입
    }
    // myChart.series.data = yData.totalCalorie;
   
  });
  // totalCalorie : Array(len).fill(0),
  // totalFat : Array(len).fill(0),
  // totalCarbohydrate : Array(len).fill(0),
  // totalProtein : Array(len).fill(0),
  // console.log("item.yDataTemp:", yDataTemp);

  // 아래가 y축 데이터 바꾼는거
  // xData.totalCalorie = yData.totalCalorie;
  option.series.data = xData.totalCalorie;
  myChart.setOption(option, true);
  // console.log("xData.dates:", xData.totalCalorie);
  
  // 0인덱스 부터 ydata 길이만큼 temp를 넣겟다 
  // ydata 기존값 날리면서 새로운 데이터 넣기
  // yData.splice(0, xData.dayName.length, ...yDataTemp);

  // console.log("yData:", yData);
}

const init= () =>{


  
};

onMounted(async () => {

  await nextTick(); // DOM 업데이트가 완료될 때까지 기다림
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value); // ECharts 인스턴스 초기화    
    await getStatistic(weekDay.getWeekDate); // 주 시작 과 끝 보내서 데이터 받아오기    
    // myChart.setOption(option, true); // 차트 옵션 설정
  } else {
    console.warn('chartRef is null');
  }

  // 차트 클릭 이벤트 핸들러
  myChart.on("click", (params) => {
    if (params.componentType === "series") {
      const dataIndex = params.dataIndex;
      const dayName = xData.dates[dataIndex];
      ondayMealData.mealFormData(dayName);
    }
    // 요일을 클릭해도 해당 요일에 대한 값이 나옴 
    else if (params.componentType === 'xAxis') {
      console.log("Clicked on:", params.dataIndex);
      const dataIndex = params.dataIndex;
      const dayName = xData.dates[dataIndex];
      ondayMealData.mealFormData(dayName);
    }

  });
  // console.log("주시작 : ", weekDay.getWeekDate);
   // resize 이벤트 등록
   window.addEventListener('resize', handleResize)
});

// onBeforeUnmount(() => {
//   // 컴포넌트 unmount 시 이벤트 해제
//   window.removeEventListener('resize', handleResize)
//   myChart?.dispose()
// })

function handleResize() {
  myChart?.resize()
}


watch(weekDay.getWeekDate, (newVal) => {
  newWeekFunc(newVal);
});

const newWeekFunc = async (param) => {
  // console.log("파람::" , param);
  await nextTick();
  await getStatistic(weekDay.getWeekDate);
  // myChart = echarts.init(chartRef.value);
  // myChart.setOption(option,true);  
};

watch (
  () => clickProgress.nowCategory,  
 (newProgress)=>{
   // 아래가 y축 데이터 바꾼는거
  //  xData.totalCalorie = yData.totalCalorie;
  option.series.data = xData.totalCalorie;
  // console.log("클릭시 탄수 :",  clickProgress.nowCategory);
  switch ( newProgress){
    
    case '탄수화물':
      option.series.data = xData.totalCarbohydrate;
      break;
    case '단백질':
      option.series.data = xData.totalProtein;
      break;
    case '지방':
      option.series.data = xData.totalFat;
      break;
    case '칼로리':
    default :
      option.series.data = xData.totalCalorie;
      break;
    }

 
  option.title.text = `주간 총 ${clickProgress.nowCategory} 통계`;
   return myChart.setOption(option, true);
  //  myChart.setOption({
  //   series: [{ data: newData }]
  // });
});


</script>

<template>
  <div  ref="chartRef" class="weekly-calorie  h-100 w-100  ">
    <div class="main-container  border   ">
      
    </div>
    
  </div>
 


</template>

<style scoped>
.main-container 
{
  
}



</style>