import axios from 'axios';
axios.defaults.baseURL = '/api/OTD';

export const getWeather = () => {
  return axios.get('/weather').catch((e) => e.response);
};
