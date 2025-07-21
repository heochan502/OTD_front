import axios from '@/services/weather/weatherRequester';

export const getWeather = (memberId) => {
  console.log('js memberId', memberId);
  return axios.get(`/weather/${memberId}`).catch((e) => e.response);
};

// export const getWeather = () => {
//   return axios.get('/weather').catch((e) => e.response);
// };
