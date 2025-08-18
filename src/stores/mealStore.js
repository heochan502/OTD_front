import { defineStore } from 'pinia';
import { getMealTotalOnDay } from '@/services/meal/mealService';
import { ref } from 'vue';


export const useCalorieCalcul = defineStore('mealInfo',  () => {

  const dayStore = useDayDefine();
    const itemInfo = ref([]);
    const mealFormData = async (dateStr) =>
    {
      // 처음 화면 상단 그래프 부분 출력용
      dayStore.updateTime();
      // const dataStr = dayStore.currentTime.slice(3, 13);
      console.log(":보내는 날짜 :", dateStr);
      const getData = await getMealTotalOnDay(dateStr);
      if (!getData.value)
      {
        itemInfo.value =[ 
          {
            "mealDay": dateStr,
            "allDayCalorie":0,
            "totalFat": 0,
            "totalCarbohydrate": 0,
            "totalProtein": 0,
          }];         
      }     
      // getData null 일때  다른 값 들어가게 해야함
      else{
      itemInfo.value = [
        {
          mealDay: getData.mealDay,
          allDayCalorie: getData.totalCalorie,
          totalFat: getData.totalFat,
          totalCarbohydrate: getData.totalCarbohydrate,
          totalProtein: getData.totalProtein,
        },
      ];
   
      }
      console.log(":가져오는 값 :", itemInfo.value);
    }
    
 


    return { itemInfo,  mealFormData };
  }
);

export const useDayDefine = defineStore("useDayDefine",()=>
    {
      // 0 - 아침  1 - 점심 2- 저녁
      const dayDefine = ref("");

      const currentTime = ref("");
      const nowDay = ref();
      const updateTime = (times) => {
        let now = new Date();
        // times가 주어지면 그 시간을 사용, 아니면 현재 시간 사용
        if (times) {
            now = new Date(times);
          
        }
        else{
            now = new Date();   
        }
        // const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const ampm = String(now.getHours() - 12 <= 0 ? "오전" : "오후");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        if(times){
          return `${ampm} ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        currentTime.value = `${ampm} ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      // 컴포넌트가 호출되면 바로 현재시간 설정
      const initCurrentTime = () => {
        // const now = new Date();
        nowDay.value = new Date().toISOString().slice(0, 10); // 혹은 '월 2024-07-28' 등
      };

      initCurrentTime(); // 자동 초기화 실행

      return { dayDefine, updateTime, currentTime, nowDay };
    },
    {
      persist: true  // 🔥 이 한 줄로 localStorage 자동 저장/복원됨
    }
);


// 하루의 모든 
export const useAlldayMeal = defineStore("useAllDayDefine", ()=>{

     const dayMealCategory = ref({
       amount: [],
       foodDbId: [],
       totalCalorie: '',
       mealDay: '',
       mealBrLuDi: '',
     });
     return { dayMealCategory };
}
);
// 주의 시작과 끝
export const useBaseDate = defineStore("useBaseDate",()=>{
  const getWeekDate= ref({
    startDate:'',
    endDate:''
  })
  return { getWeekDate };
});

// 주간 전체 데이터 
export const useWeeklyStore = defineStore('weekly', ()=>{
  const weeklyRawData = ref([]);
  const weekyDate = ref([]);
  return {
    weeklyRawData,
    weekyDate
  };
});

// 프로그래스 바 눌렀을때 변경되는거
export const useClickProgressBar = defineStore('useClickProgressBar', ()=>{
  const nowCategory = ref(0);
  
  const nowProgress= (category)=>{
    // category : 0 totalCalorie 전체 칼로리
    // 1: tansu 탄수화물  * 4 배수
    // 2: protein  단백질  * 4 배수
    // 3: jibang 지방  * 9 배수
    return this.nowCategory = category === 0 ? 0 : category === 1 ? 1:2;
  }
}
)