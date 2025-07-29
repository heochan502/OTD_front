<script setup>
import { onMounted, ref, nextTick, reactive } from 'vue';

import { useBaseDate } from '@/stores/mealStore';
import { getWeekTotal } from '@/services/meal/mealService'
import MealStatistic from './MealStatistic.vue';

import * as echarts from 'echarts';



const weekDay = useBaseDate();

const xData = ['월', '화', '수', '목', '금', '토', '일'];
const yData = [0, 0,  0,  0,  0,  0,  0];
const getYData = reactive({
  items:[]
});

const getDayName = (dateString) => {
  const days = ['월', '화', '수', '목', '금', '토','일'];
  const date = new Date(dateString);
  return days[date.getDay()];
};



const chartRef = ref(null); // 차트 DOM 요소 참조
let myChart = null; // ECharts 인스턴스

const option = {
  // 차트 옵션 설정
  //마우스 올렸을때 나오는 정보값
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      // 막대 그래프는 일반적으로 하나만 있어서 params[0] 사용
      const data = params[0];
      // data.marker는 색상 표시
      // data.data는 해당 데이터 값
      // data.axisValue는 x축의 값
      return `${data.axisValue}요일 <br />${data.marker} ${data.data.toLocaleString()} kcal`;
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
    data: xData,
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
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#000000',
      fontSize: 14,
      fontWeight: 'bold',
      formatter: '{value} kcal', // y축 값 옆에 단위 추가
    },
    splitLine: {
      lineStyle: {
        color: '#cccccc', // 눈금선 색상
        type: 'dashed', // 점선으로 표시
      },
    },
  },
  // 차트 스타일 설정
  series: [
    {
      name: '요일 ',
      type: 'bar',
      seriesLayoutBy: 'row',
      data: yData,
      // 막대그래프 스타일 설정

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
    },
  ],
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
const getStatistic = async(weeky)=>{
  
  const res = await getWeekTotal(weeky);
  if (res.status === 200)
  {
    getYData.items = res.data;
  }
  console.log("데이터 확인 ", getYData.items);

  getYData.items.forEach(item => {
    const dayName = getDayName(item.mealDay); // '화', '수', ...
    const index = xData.indexOf(dayName);      // 요일 인덱스 찾기   
    if (index !== -1) {
      yData[index] = item.totalCalorie;       // 해당 요일 자리에 값 대입
    }
  });
}

onMounted(async () => {
  
  await nextTick(); // DOM 업데이트가 완료될 때까지 기다림
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value); // ECharts 인스턴스 초기화    
    await getStatistic(weekDay.getWeekDate);
    myChart.setOption(option); // 차트 옵션 설정
  } else {
    console.warn('chartRef is null');
  }
  
  
});
</script>

<template>
  <div class="weekly-calorie  ">
    <div ref="chartRef" class="main-container  " style="height: 500px; width: 100%"></div>
  </div>

  <MealStatistic />
</template>

<style scoped>
.weekly-calorie {
  width: 80%;
  height: 100%;
}
.main-container {
  width: 80%;
}
</style>
