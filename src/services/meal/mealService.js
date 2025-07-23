import axios from 'axios';

axios.defaults.baseURL = 'api/OTD/';



export const getFoodNames = async (foodInfo) => {
    
  console.log('json', foodInfo);
    const res = await axios.get('meal', {params : foodInfo});
    if (res.status !== 200) {
        throw new Error(`Error fetching food names: ${res.statusText}`);
    }

    return res.data;
}