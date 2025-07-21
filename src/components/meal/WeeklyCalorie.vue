<script setup>
import { onMounted, reactive, ref, onBeforeUnmount, nextTick } from 'vue';
import { VueEcharts } from 'vue3-echarts';
import * as echarts from 'echarts';

const xData = ['월', '화', '수', '목', '금', '토', '일'];
const yData = xData.map(() => parseInt(Math.random() * 100));
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
      return `${data.axisValue} <br />${data.marker} ${data.data} kcal`;
    },
  },
  // 범례 설정
  xAxis: {
    type: 'category',
    data: xData,
  },
  yAxis: {
    min: 0,
    max: 100,
    type: 'value',
  },
  // 차트 스타일 설정
  series: [
    {
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
      grid: {
        left: '1%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
    },
  ],
};

onMounted(async () => {
  

  await nextTick(); // DOM 업데이트가 완료될 때까지 기다림
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value); // ECharts 인스턴스 초기화
    myChart.setOption(option); // 차트 옵션 설정
  } else {
    console.warn('chartRef is null');
  }
});
</script>

<template>
  <div class="weekly-calorie">
    <div
      ref="chartRef"
      class="main-container"
      style="height: 350px; width: 100%; "
    />
  </div>
</template>

<style scoped>
.weekly-calorie {
  width: 100%;
  height: 100%;
}
.main-container{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}
.echarts canvas {
  bottom: 0 !important;
  top: auto !important;
}

</style>
