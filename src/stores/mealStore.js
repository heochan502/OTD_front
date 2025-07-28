import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCalorieCalcul = defineStore('calculCal', () => {
    const itemInfo = ref([
      {
        totalCalorie: 0,
        allDayCalorie: '',
        totalFat: '',
        totalCarbohydrate: '',
        totalProtein: '',
        mealTime:'',
      },
    ]);

    const inputFoodInfo = (foodInfo) => {
    itemInfo.value.push(foodInfo);
    };

    const getItemInfoByIndex = (index) => {
    return itemInfo.value[index];
    };

    return { itemInfo, inputFoodInfo, getItemInfoByIndex };
});

export const useDayDefine = defineStore("useDayDefine",()=>
    {
        // 0 - 아침  1 - 점심 2- 저녁 
        const dayDefine = ref(null);        
        
     return {dayDefine };
        
    }
);

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


