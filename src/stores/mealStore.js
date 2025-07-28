import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCalorieCalcul = defineStore('calculCal', () => {
    const itemInfo = ref([
    {
        foodDbId: '',
        getFoodName: '',
        calorie: ''
    }
    ]);

    const inputFoodInfo = (foodInfo) => {
    itemInfo.value.push(foodInfo);
    };

    const getItemInfoByIndex = (index) => {
    return itemInfo.value[index];
    };

    return { itemInfo, inputFoodInfo, getItemInfoByIndex };
});