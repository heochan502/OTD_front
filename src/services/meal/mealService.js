import axios from 'axios';

axios.defaults.baseURL = '/api/OTD/';





export const getFoodNames = async (foodInfo) => {
    



   console.log('음식 검색', foodInfo);
    const res = await axios.get('meal', {params : foodInfo});
    if (res.status !== 200) {
        throw new Error(`Error fetching food names: ${res.statusText}`);
    }
 console.log('json', res.data);
    return res.data;
}


export const getFoodCalorie = async (foodInfo)=>{
  console.log('json 음식정보', foodInfo);
  const res = await axios.get('meal/calcul',{params : foodInfo} );
  console.log('json이겟지? :', res.data);
  if(res.status !==200)
  {
    throw new Error(`Error fethcing food calorie: ${res.statusText}`);
  }
  // const data = res.data;
  // console.log('json이겟지222? :', data);
  return res.data;
}