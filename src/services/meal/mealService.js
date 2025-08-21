import axios from 'axios';

axios.defaults.baseURL = '/api/OTD/';




// 데이터 가져오는곳
export const getFoodNames = async (foodInfo) => {
    
  //  console.log('음식 검색', foodInfo);
    const res = await axios.get('meal', {params : foodInfo});
    if (res.status !== 200) {
        throw new Error(`Error fetching food names: ${res.statusText}`);
    }
//  console.log('json', res.data);
    return res.data;
}

 
export const getFoodCalorie = async (foodInfo)=>{
  // console.log('json 음식정보', foodInfo);
  const res = await axios.get('meal/calcul',{params : foodInfo} );
  // console.log('json이겟지? :', res.data);
  if(res.status !==200)
  {
    throw new Error(`Error fethcing food calorie: ${res.statusText}`);
  }
  // const data = res.data;
  // console.log('json이겟지222? :', data);
  return res.data;
}

export const getMealData = async (getlist) => {
  // console.log("json 음식정보", getlist);
  const res = await axios.get("meal/getMeal", {params :getlist});
  // console.log("json이겟지? :", res.data);
  // const data = res.data;
  // console.log('json이겟지222? :', data);
  return res.data;
};

export const getMealTotalOnDay = async (nowDay) => {
    // console.log('오늘 정보', nowDay);
  const res = await axios.get("meal/eatenMeal", {params :{mealDay:nowDay}});
  // console.log("json이겟지? :", res.data);
  // const data = res.data;
  return res.data;
};


export const getWeekTotal = async (weeky) => {
  // console.log("주간", weeky);
  const res = await axios.get("meal/statsMeal", { params:weeky});
  // console.log("json이겟지? :", res.data);
  return res;
};


// 데이터 수정

export const inputMealData = async (mealData)=>{
  // console.log('json 음식정보', foodInfo);
  const res = await axios.post('meal/saveMeal', mealData );
  // console.log('json이겟지? :', res.data);  
  // const data = res.data;
  // console.log('json이겟지222? :', data);
  return res.data;
}



///수정

export const modifyMealdata = async (mealData) => {
  // console.log("json 음식정보", mealData);
  const res = await axios.put("meal/modifyMeal", mealData);
  // console.log('json이겟지? :', res.data);
  // const data = res.data;
  // console.log('json이겟지222? :', data);
  return res.data;
};