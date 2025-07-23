import axios from 'axios';

axios.defaults.baseURL = 'api/OTD/';



export const getFoodNames = async (foodName) => {
    
  console.log('json', foodName);
    const res = await axios.get('meal',{params : {foodName}});
    if (res.status !== 200) {
        throw new Error(`Error fetching food names: ${res.statusText}`);
    }

    return res.data;
}